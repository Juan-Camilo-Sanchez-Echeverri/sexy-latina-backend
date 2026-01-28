import { Injectable, PipeTransform } from '@nestjs/common';

import { CountriesService } from '@modules/countries/countries.service';

import { FilterStatesDto } from '../dto';

@Injectable()
export class FilterStatesPipe implements PipeTransform {
  constructor(private readonly countriesService: CountriesService) {}

  async transform(value: FilterStatesDto): Promise<FilterStatesDto> {
    const countryId = value.country;

    await this.countriesService.findOneById(countryId);

    value.data.country = countryId;

    return value;
  }
}
