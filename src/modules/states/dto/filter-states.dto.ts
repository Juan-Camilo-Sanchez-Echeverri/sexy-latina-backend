import { IsMongoId } from 'class-validator';

import { FilterDto } from '@common/dto';

import { StateDocument } from '../schemas/state.schema';

export class FilterStatesDto extends FilterDto<StateDocument> {
  /**
   * Country id to filter states
   */
  @IsMongoId()
  country: string;
}
