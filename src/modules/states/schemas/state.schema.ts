import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import type { PopulatedEntity } from '@common/helpers/mongo.helpers';

import {
  Country,
  CountryDocument,
} from '@modules/countries/schemas/country.schema';

export type StateDocument = HydratedDocument<State>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class State {
  /**
   * State code
   */
  @Prop({ required: true, trim: true, index: true })
  code: string;

  /**
   * State name
   */
  @Prop({ required: true })
  name: string;

  /**
   * Parent country
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Country.name,
    index: true,
  })
  country: PopulatedEntity<CountryDocument, '_id' | 'name' | 'code'>;
}

export const StateSchema = SchemaFactory.createForClass(State);
