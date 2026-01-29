import { IsMongoId } from 'class-validator';

import { FilterDto } from '@common/dto';

import { CityDocument } from '../schema/city.schema';

export class FilterCitiesDto extends FilterDto<CityDocument> {
  /**
   * State id to filter cities by
   */
  @IsMongoId()
  state: string;

  /**
   * Country id to filter cities by
   */
  @IsMongoId()
  country: string;
}
