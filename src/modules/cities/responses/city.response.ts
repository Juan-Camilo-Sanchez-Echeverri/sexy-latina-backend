import { OmitType, PickType } from '@nestjs/swagger';

import { City } from '../schema/city.schema';

import { StateResponse } from '@modules/states/responses/state.response';
import { CountryResponse } from '@modules/countries/responses/country.response';

class StateResponseCity extends PickType(StateResponse, [
  '_id',
  'name',
  'code',
] as const) {}

class CountryResponseCity extends PickType(CountryResponse, [
  '_id',
  'name',
  'code',
] as const) {}

export class CityResponse extends OmitType(City, ['state', 'country']) {
  /**
   * Identifier
   */
  _id: string;

  /**
   * State of the city
   */
  state: StateResponseCity;

  /**
   * Country of the city
   */
  country: CountryResponseCity;
}
