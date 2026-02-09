import { IntersectionType, OmitType } from '@nestjs/swagger';

import { CreateUserDto } from '@modules/users/dto';
import { CreateModelDto } from '@modules/models/dto';

export class RegisterModelDto extends IntersectionType(
  OmitType(CreateUserDto, ['roles', 'status']),
  OmitType(CreateModelDto, ['user']),
) {}
