import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import type { PopulatedEntity } from '@common/helpers';

import {
  State,
  type StateDocument,
} from '@modules/states/schemas/state.schema';

import {
  Country,
  type CountryDocument,
} from '@modules/countries/schemas/country.schema';

export type CityDocument = HydratedDocument<City>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class City {
  /**
   * City name
   */
  @Prop({ required: true })
  name: string;

  /**
   * City code
   */
  @Prop({ required: true })
  code: string;

  /**
   * Parent state
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: State.name })
  state: PopulatedEntity<StateDocument, '_id' | 'name' | 'code'>;

  /**
   * Parent country
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Country.name,
  })
  country: PopulatedEntity<CountryDocument, '_id' | 'name' | 'code'>;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ state: 1, country: 1 });
