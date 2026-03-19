import { IntersectionType, PickType } from '@nestjs/swagger';

import { CreateUserDto } from '@modules/users/dto';

export class RegisterModelDto extends IntersectionType(
  PickType(CreateUserDto, ['email', 'password']),
) {}
