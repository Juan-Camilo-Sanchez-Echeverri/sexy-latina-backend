import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
  /**
   * Country code
   */
  @Prop({ required: true, unique: true, index: true })
  code: string;

  /**
   * Country name
   */
  @Prop({ required: true, unique: true, index: true })
  name: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
