import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult } from 'mongoose';

import { CacheService } from '@modules/cache/cache.service';

import { FilterCountryDto } from './dto';

import { CountryErrors } from './errors/countries.errors';

import { CountriesRepository } from './repositories/countries.repository';

import { CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountriesService {
  constructor(
    private readonly countriesRepository: CountriesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findPaginate(
    query: FilterCountryDto,
    cacheKey: string,
  ): Promise<PaginateResult<CountryDocument>> {
    const cached =
      await this.cacheService.get<PaginateResult<CountryDocument>>(cacheKey);

    if (cached) return cached;

    const result = await this.countriesRepository.findPaginate(query, {
      sort: { name: 1 },
    });

    await this.cacheService.set(cacheKey, result);

    return result;
  }

  async findOneById(id: string): Promise<CountryDocument> {
    const country = await this.countriesRepository.findOneById(id);

    if (!country) throw new NotFoundException(CountryErrors.NOT_FOUND);

    return country;
  }
}
