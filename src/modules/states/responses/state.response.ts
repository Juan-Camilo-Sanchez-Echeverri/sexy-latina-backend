import { OmitType, PickType } from '@nestjs/swagger';

import { CountryResponse } from '@modules/countries/responses/country.response';

import { State } from '../schemas/state.schema';

class CountryResponseState extends PickType(CountryResponse, [
  '_id',
  'name',
  'code',
] as const) {}

export class StateResponse extends OmitType(State, ['country']) {
  /**
   * Identifier of the state
   */
  _id: string;

  /**
   * Country of the state
   */
  country: CountryResponseState;
}
