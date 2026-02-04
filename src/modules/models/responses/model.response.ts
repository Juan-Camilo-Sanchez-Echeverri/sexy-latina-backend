import { OmitType, PickType } from '@nestjs/swagger';

import { UserResponse } from '@modules/users/responses/user.response';
import { CityResponse } from '@modules/cities/responses/city.response';
import { StateResponse } from '@modules/states/responses/state.response';
import { CountryResponse } from '@modules/countries/responses/country.response';

import { Model } from '../schemas/model.schema';

class UserResponseModel extends PickType(UserResponse, [
  '_id',
  'firstName',
  'lastName',
  'phone',
] as const) {}

class CityResponseModel extends PickType(CityResponse, [
  '_id',
  'name',
] as const) {}

class StateResponseModel extends PickType(StateResponse, [
  '_id',
  'name',
] as const) {}

class CountryResponseModel extends PickType(CountryResponse, [
  '_id',
  'name',
] as const) {}

export class ModelResponse extends OmitType(Model, [
  'user',
  'city',
  'state',
  'country',
] as const) {
  /**
   * Model identifier
   */
  _id: string;

  /**
   * User owner of the profile
   */
  user: UserResponseModel;

  /**
   * City
   */
  city: CityResponseModel;

  /**
   * State
   */
  state: StateResponseModel;

  /**
   * Country
   */
  country: CountryResponseModel;
}
