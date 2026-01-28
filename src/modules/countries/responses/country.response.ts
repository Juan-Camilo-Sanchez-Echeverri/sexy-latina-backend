import { Country } from '../schemas/country.schema';

export class CountryResponse extends Country {
  /**
   * Identifier of the country
   */
  _id: string;
}
