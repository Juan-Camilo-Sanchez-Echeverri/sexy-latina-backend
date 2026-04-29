import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument, Types } from 'mongoose';

import { BaseSchema } from '@common/database';

import type { PopulatedEntity } from '@common/helpers';

import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { City, CityDocument } from '@modules/cities/schema/city.schema';
import { State, StateDocument } from '@modules/states/schemas/state.schema';
import {
  Country,
  CountryDocument,
} from '@modules/countries/schemas/country.schema';

import { ModelCategory, Nationality, Language } from '../enums';

import {
  AvailabilitySchedule,
  AvailabilityScheduleSchema,
} from './availability-schedule.schema';

import { ServicePrice, ServicePriceSchema } from './service-price.schema';
import { SocialLinks, SocialLinksSchema } from './social-links.schema';
import { PortfolioItem, PortfolioItemSchema } from './portfolio-item.schema';

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class Model extends BaseSchema {
  /**
   * Reference to the user who owns this model profile
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: PopulatedEntity<UserDocument, '_id' | 'name' | 'phone'>;

  /**
   * Age
   */
  @Prop()
  age?: number;

  /**
   * Portfolio of images/videos (URLs)
   */
  @Prop({ type: [PortfolioItemSchema], default: [] })
  portfolio: PortfolioItem[];

  /**
   * List of services offered with prices
   */
  @Prop({ type: [ServicePriceSchema], default: [] })
  services: ServicePrice[];

  /**
   * Reference to city (approximate location)
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: City.name,
  })
  city?: PopulatedEntity<CityDocument, '_id' | 'name'>;

  /**
   * Reference to state
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: State.name,
  })
  state?: PopulatedEntity<StateDocument, '_id' | 'name'>;

  /**
   * Reference to country
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Country.name,
  })
  country?: PopulatedEntity<CountryDocument, '_id' | 'name'>;

  /**
   * Nationality
   */
  @Prop({ type: String, enum: Nationality })
  nationality?: Nationality;

  /**
   * Languages spoken
   */
  @Prop({
    type: [String],
    enum: Language,
    default: [Language.SPANISH],
  })
  languages: Language[];

  /**
   * Social media links
   */
  @Prop({ type: SocialLinksSchema, default: () => ({}) })
  socialLinks: SocialLinks;

  /**
   * Availability schedule by day of week
   */
  @Prop({ type: [AvailabilityScheduleSchema], default: [] })
  availability: AvailabilitySchedule[];

  /**
   * Model categories (can have multiple)
   */
  @Prop({ type: [String], enum: ModelCategory, default: [] })
  categories: ModelCategory[];

  /**
   * Profile description or bio
   */
  @Prop()
  description: string;

  /**
   * Height in centimeters
   */
  @Prop()
  height: number;

  /**
   * Weight in kilograms
   */
  @Prop()
  weight: number;

  /**
   * Whether the model is verified
   */
  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  /**
   * Image profile
   */
  @Prop({ type: String, default: null })
  profilePhoto: string | null;
}

export const ModelSchema = SchemaFactory.createForClass(Model);

export type ModelDocumentOverride = {
  portfolio: Types.DocumentArray<PortfolioItem>;
};

export type ModelDocument = HydratedDocument<Model, ModelDocumentOverride>;

ModelSchema.index({ categories: 1 });
ModelSchema.index({ city: 1 });
ModelSchema.index({ state: 1 });
ModelSchema.index({ country: 1 });
ModelSchema.index({ isActive: 1 });
ModelSchema.index({ status: 1 });
ModelSchema.index({ verified: 1 });
ModelSchema.index({ nationality: 1 });
ModelSchema.index({ languages: 1 });
