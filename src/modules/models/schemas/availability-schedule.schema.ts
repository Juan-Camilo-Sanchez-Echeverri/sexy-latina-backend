import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvailabilityScheduleDocument =
  HydratedDocument<AvailabilitySchedule>;

/**
 * Availability schedule schema
 */
@Schema({ _id: false })
export class AvailabilitySchedule {
  /**
   * Day of week (0 = Sunday, 6 = Saturday)
   */
  @Prop({ required: true, min: 0, max: 6 })
  day: number;

  /**
   * Start time (24h format, e.g., "09:00")
   */
  @Prop({ required: true })
  startTime: string;

  /**
   * End time (24h format, e.g., "18:00")
   */
  @Prop({ required: true })
  endTime: string;

  /**
   * Whether available on this day
   */
  @Prop({ required: true, default: true })
  available: boolean;
}

export const AvailabilityScheduleSchema =
  SchemaFactory.createForClass(AvailabilitySchedule);
