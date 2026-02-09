import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { IsNotBlank } from '@common/decorators';

import { ModelCategory, Nationality, Language } from '../enums';

import { AvailabilityScheduleDto } from './availability-schedule.dto';
import { ServicePriceDto } from './service-price.dto';
import { SocialLinksDto } from './social-links.dto';

export class CreateModelDto {
  /**
   * User Id owner of the profile
   */
  @IsMongoId()
  user: string;

  /**
   * Age
   */
  @IsInt()
  @Min(18)
  readonly age: number;

  /**
   * List of services offered with prices
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePriceDto)
  readonly services: ServicePriceDto[];

  /**
   * City
   */
  @IsMongoId()
  readonly city: string;

  /**
   * State
   */
  @IsMongoId()
  readonly state: string;

  /**
   * Country
   */
  @IsMongoId()
  readonly country: string;

  /**
   * Nationality
   */
  @IsEnum(Nationality)
  readonly nationality: Nationality;

  /**
   * Languages spoken
   */
  @IsArray()
  @IsEnum(Language, { each: true })
  readonly languages: Language[];

  /**
   * Social media links
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  readonly socialLinks: SocialLinksDto;

  /**
   * Availability schedule
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityScheduleDto)
  readonly availability: AvailabilityScheduleDto[];

  /**
   * Model categories
   */
  @IsArray()
  @IsEnum(ModelCategory, { each: true })
  readonly categories: ModelCategory[];

  /**
   * Profile description or bio
   */
  @IsNotBlank()
  readonly description: string;

  /**
   * Height in centimeters
   */
  @IsNumber()
  @Min(100)
  @Max(250)
  readonly height: number;
}
