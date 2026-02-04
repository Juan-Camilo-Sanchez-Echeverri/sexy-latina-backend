import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServicePriceDocument = HydratedDocument<ServicePrice>;

/**
 * Service pricing schema
 */
@Schema({ _id: false })
export class ServicePrice {
  /**
   * Service name
   */
  @Prop({ required: true })
  name: string;

  /**
   * Service price
   */
  @Prop({ required: true, min: 0 })
  price: number;

  /**
   * Duration in minutes
   */
  @Prop({ min: 1 })
  duration?: number;

  /**
   * Additional service description
   */
  @Prop()
  description?: string;
}

export const ServicePriceSchema = SchemaFactory.createForClass(ServicePrice);
