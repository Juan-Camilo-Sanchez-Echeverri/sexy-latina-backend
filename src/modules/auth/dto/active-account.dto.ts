import { IsEmail } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class ActivateAccountDto {
  @IsNotBlank()
  token: string;

  @IsEmail()
  email: string;
}
