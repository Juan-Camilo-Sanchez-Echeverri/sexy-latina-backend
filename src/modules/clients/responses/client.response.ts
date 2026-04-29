import { OmitType, PickType } from '@nestjs/swagger';

import { UserResponse } from '@modules/users/responses/user.response';
import { CityResponse } from '@modules/cities/responses/city.response';
import { StateResponse } from '@modules/states/responses/state.response';
import { CountryResponse } from '@modules/countries/responses/country.response';

import { Client } from '../schemas/client.schema';

class UserResponseClient extends PickType(UserResponse, [
  '_id',
  'name',
  'phone',
] as const) {}

class CityResponseClient extends PickType(CityResponse, [
  '_id',
  'name',
] as const) {}

class StateResponseClient extends PickType(StateResponse, [
  '_id',
  'name',
] as const) {}

class CountryResponseClient extends PickType(CountryResponse, [
  '_id',
  'name',
] as const) {}

export class ClientResponse extends OmitType(Client, [
  'user',
  'city',
  'state',
  'country',
] as const) {
  /**
   * Client identifier
   */
  _id: string;

  /**
   * User owner of the profile
   */
  user: UserResponseClient;

  profilePhoto: string | null;

  age: number;

  /**
   * City
   */
  city: CityResponseClient;

  /**
   * State
   */
  state: StateResponseClient;

  /**
   * Country
   */
  country: CountryResponseClient;
}
