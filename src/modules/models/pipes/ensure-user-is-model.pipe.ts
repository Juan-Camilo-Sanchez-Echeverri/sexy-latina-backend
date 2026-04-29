import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

import { UsersService } from '@modules/users/users.service';

import { UserRole } from '@common/enums';

import { ModelsErrors } from '../errors/models.errors';

import { CreateModelDto } from '../dto';

@Injectable()
export class EnsureUserIsModelPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: CreateModelDto): Promise<CreateModelDto> {
    const userId = value.user;

    const userExists = await this.usersService.findOneBy({
      _id: userId,
      roles: { $in: [UserRole.MODEL] },
    });

    if (!userExists) {
      throw new NotFoundException(ModelsErrors.USER_IS_NOT_A_MODEL);
    }

    return value;
  }
}
