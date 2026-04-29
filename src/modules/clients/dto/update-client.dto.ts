import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(
  OmitType(CreateClientDto, ['user'] as const),
) {
  /**
   * URL of the client's profile photo or null. To delete the profile photo, send null.
   */
  @IsOptional()
  profilePhoto?: string | null;
}
