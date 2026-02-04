import { IsBoolean, IsNumber, Max, Min } from 'class-validator';
import { IsNotBlank } from '@common/decorators';

export class AvailabilityScheduleDto {
  /**
   * Day of week (0 = Sunday, 6 = Saturday)
   */
  @IsNumber()
  @Min(0)
  @Max(6)
  readonly day: number;

  /**
   * Start time (24h format)
   */
  @IsNotBlank()
  readonly startTime: string;

  /**
   * End time (24h format)
   */
  @IsNotBlank()
  readonly endTime: string;

  /**
   * Whether available on this day
   */
  @IsBoolean()
  readonly available: boolean;
}
