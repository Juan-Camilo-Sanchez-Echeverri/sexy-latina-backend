import { OmitType, PartialType } from '@nestjs/swagger';

import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateModelDto } from './create-model.dto';
import { Nationality } from '../enums';

class UpdateModelUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateModelDto extends PartialType(
  OmitType(CreateModelDto, ['user', 'nationality'] as const),
) {
  /** * URL of the model's profile photo or null. To delete the profile photo, send null.
   */
  @IsOptional()
  profilePhoto?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @ValidateIf((o) => o.nationality !== null)
  @IsEnum(Nationality)
  nationality?: Nationality | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateModelUserDto)
  user?: UpdateModelUserDto;
}
