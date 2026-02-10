import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type PortafolioItemDocument = HydratedDocument<PortafolioItem>;

@Schema()
export class PortafolioItem {
  /**
   * Unique identifier for the portafolio item.
   */
  _id: string;

  /**
   * URL or path for the portafolio item.
   */
  @Prop({ required: true, trim: true })
  url: string;
}

export const PortafolioItemSchema =
  SchemaFactory.createForClass(PortafolioItem);
