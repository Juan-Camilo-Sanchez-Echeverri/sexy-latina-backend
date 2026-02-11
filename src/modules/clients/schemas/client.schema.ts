import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';
import type { PopulatedEntity } from '@common/helpers';

import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { City, CityDocument } from '@modules/cities/schema/city.schema';
import { State, StateDocument } from '@modules/states/schemas/state.schema';
import {
  Country,
  CountryDocument,
} from '@modules/countries/schemas/country.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class Client extends BaseSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user: PopulatedEntity<
    UserDocument,
    '_id' | 'firstName' | 'lastName' | 'phone'
  >;

  /**
   * Profile image path
   */
  @Prop({ type: String, default: null })
  profilePhoto: string | null;
  /**
   * Age
   */
  @Prop({ required: true })
  age: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: City.name,
    required: true,
  })
  city: PopulatedEntity<CityDocument, '_id' | 'name'>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: State.name,
    required: true,
  })
  state: PopulatedEntity<StateDocument, '_id' | 'name'>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Country.name,
    required: true,
  })
  country: PopulatedEntity<CountryDocument, '_id' | 'name'>;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
