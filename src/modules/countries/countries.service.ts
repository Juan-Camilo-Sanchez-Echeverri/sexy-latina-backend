import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult } from 'mongoose';

import { FilterCountryDto } from './dto';

import { CountryErrors } from './errors/countries.errors';

import { CountriesRepository } from './repositories/countries.repository';

import { CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountriesService {
  constructor(private readonly countriesRepository: CountriesRepository) {}

  async findPaginate(
    query: FilterCountryDto,
  ): Promise<PaginateResult<CountryDocument>> {
    return await this.countriesRepository.findPaginate(query, {
      sort: { name: 1 },
    });
  }

  async findOneById(id: string): Promise<CountryDocument> {
    const country = await this.countriesRepository.findOneById(id);

    if (!country) throw new NotFoundException(CountryErrors.NOT_FOUND);

    return country;
  }
}
