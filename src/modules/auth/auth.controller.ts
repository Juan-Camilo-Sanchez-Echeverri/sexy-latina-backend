import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiConflictResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  CurrentUser,
  Public,
} from '@common/decorators';

import { EmailRequestErrors } from '@modules/email-request/errors/email-request.errors';
import { UserResponse } from '@modules/users/responses/user.response';
import type { UserDocument } from '@modules/users/schemas/user.schema';

import {
  ActivateAccountDto,
  ChangePasswordDto,
  LoginAuthDto,
  RecoverPasswordDto,
  ResetPasswordDto,
} from './dto';

import { AuthService } from './auth.service';

import {
  ChangePasswordResponse,
  LoginResponse,
  RecoverPasswordResponse,
  ResetPasswordResponse,
} from './responses';

import { AuthExamples } from './swagger/auth.examples';

import { AuthErrors } from './errors/auth.errors';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login to your account
   *
   * @remarks Log in with credentials and return access and refresh tokens.
   *
   * @param loginAuthDto The user's login credentials.
   * @returns JWT tokens including accessToken and refreshToken.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(LoginResponse, { isPaginate: false })
  @ApiValidationResponseWrapper(AuthExamples.login)
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<LoginResponse> {
    return await this.authService.login(loginAuthDto);
  }

  /**
   * Recover password
   *
   * @remarks Send an email to the user with a link to recover their password.
   *
   */
  @Public()
  @Post('recover-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(RecoverPasswordResponse, { isPaginate: false })
  @ApiValidationResponseWrapper(AuthExamples.recoverPassword)
  @ApiConflictResponseWrapper(EmailRequestErrors.MAX_ATTEMPTS_REACHED)
  @ApiUnauthorizedResponse({ example: AuthErrors.EMAIL_NOT_FOUND })
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ): Promise<RecoverPasswordResponse> {
    await this.authService.recoverPassword(recoverPasswordDto);

    return { send: true };
  }

  /**
   * Reset password
   *
   * @remarks Reset the user's password using a token sent to their email.
   *
   */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponseWrapper(EmailRequestErrors.TOKEN_INVALID)
  @ApiConflictResponseWrapper(EmailRequestErrors.TOKEN_EXPIRED)
  @ApiOkResponseWrapper(ResetPasswordResponse, { isPaginate: false })
  @ApiValidationResponseWrapper(AuthExamples.resetPassword)
  @ApiUnauthorizedResponse({ example: AuthErrors.EMAIL_NOT_FOUND })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Change password
   *
   * @remarks Change the password for the currently authenticated user.
   *
   */
  @Post('change-password')
  @AllRoles()
  @ApiBearerAuth()
  @ApiAuthResponses()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseWrapper(ChangePasswordResponse, { isPaginate: false })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: UserDocument,
  ): Promise<ChangePasswordResponse> {
    return await this.authService.changePassword(user, changePasswordDto);
  }

  /**
   * Get current user
   *
   * @remarks Retrieve the currently authenticated user's information.
   *
   */
  @AllRoles()
  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: UserResponse): UserResponse {
    return user;
  }

  /**
   * Activate account
   *
   * @remarks Activate the user's account using a token sent to their email.
   *
   */
  @Public()
  @Post('activate-account')
  @HttpCode(HttpStatus.OK)
  async activateAccount(
    @Body() activateAccountDto: ActivateAccountDto,
  ): Promise<{ active: boolean }> {
    return await this.authService.activateAccount(activateAccountDto);
  }

  /**
   * Request activate account
   *
   * @remarks Request an email to activate the user's account.
   *
   */
  @Public()
  @Get('activate-account')
  async requestActivateAccount(
    @Query('email') email: string,
  ): Promise<{ send: boolean }> {
    return await this.authService.requestActivateAccount(email);
  }
}
