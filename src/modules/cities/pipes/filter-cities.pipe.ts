import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { StatesService } from '@modules/states/states.service';

import { FilterCitiesDto } from '../dto';

import { CityErrors } from '../errors/cities.errors';

@Injectable()
export class FilterCitiesPipe implements PipeTransform {
  constructor(private readonly statesService: StatesService) {}

  async transform(value: FilterCitiesDto): Promise<FilterCitiesDto> {
    const stateId = value.state;
    const countryId = value.country;

    const state = await this.statesService.findOneById(stateId);

    if (
      !state.country ||
      ('_id' in state.country && String(state.country._id) !== countryId)
    ) {
      throw new BadRequestException(CityErrors.STATE_ERR);
    }

    value.data.state = stateId;
    value.data.country = countryId;

    return value;
  }
}
