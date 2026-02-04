import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class ServicePriceDto {
  /**
   * Service name
   */
  @IsNotBlank()
  readonly name: string;

  /**
   * Service price
   */
  @IsNumber()
  @Min(0)
  readonly price: number;

  /**
   * Duration in minutes
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly duration?: number;

  /**
   * Additional service description
   */
  @IsOptional()
  @IsString()
  readonly description?: string;
}
