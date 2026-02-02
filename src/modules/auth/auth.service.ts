import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { bcryptAdapter } from '@common/adapters';

import { Status } from '@common/enums';

import { DateHelper } from '@common/helpers';

import { EmailRequestService } from '@modules/email-request/email-request.service';
import { UsersService } from '@modules/users/users.service';
import { UserDocument } from '@modules/users/schemas/user.schema';

import {
  ActivateAccountDto,
  ChangePasswordDto,
  LoginAuthDto,
  RecoverPasswordDto,
  ResetPasswordDto,
} from './dto';

import { AuthErrors } from './errors/auth.errors';

import {
  ActivateAccountResponse,
  ChangePasswordResponse,
  LoginResponse,
  RecoverPasswordResponse,
  RequestActivateAccountResponse,
  ResetPasswordResponse,
} from './responses';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailRequestService: EmailRequestService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<LoginResponse> {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new UnauthorizedException(AuthErrors.USER_EMAIL_NOT_FOUND);

    this.validateUser(user);

    const matchPassword = await bcryptAdapter.compare(password, user.password);

    if (!matchPassword) {
      throw new UnauthorizedException(AuthErrors.PASSWORD_MISMATCH);
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
      roles: user.roles,
    });

    return { accessToken };
  }

  private validateUser(user: UserDocument) {
    if (user.status === Status.INACTIVE) {
      throw new UnauthorizedException(AuthErrors.USER_INACTIVE);
    }

    if (user.status === Status.DELETED) {
      throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
    }
  }

  async recoverPassword(
    recoverPasswordDto: RecoverPasswordDto,
  ): Promise<RecoverPasswordResponse> {
    const { email } = recoverPasswordDto;

    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new UnauthorizedException(AuthErrors.EMAIL_NOT_FOUND);

    const currentDate = DateHelper.getCurrentDate();
    const expiresIn = DateHelper.add(currentDate, 10, 'minutes');

    await this.emailRequestService.create({
      email,
      type: 'recoverPassword',
      expiresIn,
      firstName: user.firstName,
    });

    return { send: true };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const { token, email, password } = resetPasswordDto;

    const user = await this.usersService.findOneBy({ email });

    if (!user) throw new UnauthorizedException(AuthErrors.EMAIL_NOT_FOUND);

    await this.emailRequestService.validate({
      email,
      token,
      type: 'recoverPassword',
      firstName: user.firstName,
    });

    await this.usersService.update(String(user._id), {
      password,
    });

    return { changed: true };
  }

  async changePassword(
    user: UserDocument,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const { currentPassword, newPassword } = changePasswordDto;

    const matchPassword = await bcryptAdapter.compare(
      currentPassword,
      user.password,
    );

    if (!matchPassword) {
      throw new UnauthorizedException(AuthErrors.PASSWORD_MISMATCH);
    }

    await this.usersService.update(String(user._id), {
      password: newPassword,
    });

    return { changed: true };
  }

  async activateAccount(
    activateAccountDto: ActivateAccountDto,
  ): Promise<ActivateAccountResponse> {
    const { token, email } = activateAccountDto;

    const user = await this.usersService.findOneBy({ email });

    if (!user || user.status === Status.ACTIVE) return { active: false };

    await this.emailRequestService.validate({
      email,
      token,
      type: 'activeAccount',
      firstName: user.firstName,
    });

    await this.usersService.updateStatus(String(user._id), Status.ACTIVE);

    return { active: true };
  }

  async requestActivateAccount(
    email: string,
  ): Promise<RequestActivateAccountResponse> {
    const user = await this.usersService.findOneBy({ email });

    if (!user) return { send: false };

    if (user.status === Status.ACTIVE) return { send: false };

    const expiresIn = new Date(Date.now() + 60 * 60 * 1000);
    await this.emailRequestService.create({
      email,
      type: 'activeAccount',
      expiresIn,
      firstName: user.firstName,
    });

    return { send: true };
  }
}
