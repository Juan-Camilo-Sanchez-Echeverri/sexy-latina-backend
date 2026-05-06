import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { FilterDto } from '@common/dto';

import { ModelCategory, Nationality, Language } from '../enums';
import { ModelDocument } from '../schemas/model.schema';

export class FilterModelDto extends FilterDto<ModelDocument> {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiPropertyOptional({ description: 'Filter by verification status' })
  verified?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Minimum age (inclusive)' })
  minAge?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Maximum age (inclusive)' })
  maxAge?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search by name (case-insensitive)' })
  name?: string;

  @IsOptional()
  @IsEnum(Nationality)
  @ApiPropertyOptional({ enum: Nationality })
  nationality?: Nationality;

  @IsOptional()
  @IsEnum(ModelCategory)
  @ApiPropertyOptional({
    enum: ModelCategory,
    description: 'Filter by category',
  })
  category?: ModelCategory;

  @IsOptional()
  @IsEnum(Language)
  @ApiPropertyOptional({ enum: Language })
  language?: Language;

  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({ description: 'Filter by city ID' })
  city?: string;

  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({ description: 'Filter by state ID' })
  state?: string;

  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({ description: 'Filter by country ID' })
  country?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
