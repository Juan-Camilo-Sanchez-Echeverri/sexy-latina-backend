import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type PortfolioItemDocument = HydratedDocument<PortfolioItem>;

@Schema()
export class PortfolioItem {
  /**
   * Unique identifier for the portfolio item.
   */
  _id: string;

  /**
   * URL or path for the portfolio item.
   */
  @Prop({ required: true, trim: true })
  url: string;
}

export const PortfolioItemSchema = SchemaFactory.createForClass(PortfolioItem);
