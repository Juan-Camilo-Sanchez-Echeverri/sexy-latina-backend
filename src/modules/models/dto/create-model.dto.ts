import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

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
   *
   * @example 25
   */
  @IsOptional()
  @IsInt()
  @Min(18)
  readonly age?: number;

  /**
   * List of services offered with prices
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePriceDto)
  readonly services?: ServicePriceDto[];

  /**
   * City
   */
  @IsOptional()
  @IsMongoId()
  readonly city?: string;

  /**
   * State
   */
  @IsOptional()
  @IsMongoId()
  readonly state?: string;

  /**
   * Country
   */
  @IsOptional()
  @IsMongoId()
  readonly country?: string;

  /**
   * Nationality
   */
  @IsOptional()
  @IsEnum(Nationality)
  readonly nationality?: Nationality;

  /**
   * Languages spoken
   */
  @IsOptional()
  @IsArray()
  @IsEnum(Language, { each: true })
  readonly languages?: Language[];

  /**
   * Social media links
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  readonly socialLinks?: SocialLinksDto;

  /**
   * Availability schedule
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityScheduleDto)
  readonly availability?: AvailabilityScheduleDto[];

  /**
   * Model categories
   */
  @IsOptional()
  @IsArray()
  @IsEnum(ModelCategory, { each: true })
  readonly categories?: ModelCategory[];

  /**
   * Profile description or bio
   */
  @IsOptional()
  @IsString()
  readonly description?: string;

  /**
   * Height in centimeters
   *
   * @example 1.75
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly height?: number;

  /**
   * Weight in kilograms
   *
   * @example 60
   */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly weight?: number;
}
