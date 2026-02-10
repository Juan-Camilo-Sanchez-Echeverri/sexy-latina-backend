import { OmitType, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateModelDto } from './create-model.dto';

export class UpdateModelDto extends PartialType(
  OmitType(CreateModelDto, ['user'] as const),
) {
  /** * URL of the model's profile photo or null. To delete the profile photo, send null.
   */
  @IsOptional()
  profilePhoto?: string | null;
}
