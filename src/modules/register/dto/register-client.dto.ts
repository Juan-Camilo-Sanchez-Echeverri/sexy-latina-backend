import { IntersectionType, OmitType } from '@nestjs/swagger';

import { CreateUserDto } from '@modules/users/dto';
import { CreateClientDto } from '@modules/clients/dto';

export class RegisterClientDto extends IntersectionType(
  OmitType(CreateUserDto, ['roles', 'status']),
  OmitType(CreateClientDto, ['user']),
) {}
