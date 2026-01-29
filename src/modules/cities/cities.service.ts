import { Injectable } from '@nestjs/common';

import type { PaginateResult, PopulateOptions } from 'mongoose';

import { CacheService } from '@modules/cache/cache.service';

import { FilterCitiesDto } from './dto';

import { CityDocument } from './schema/city.schema';

import { CitiesRepository } from './repositories/cities.repository';

@Injectable()
export class CitiesService {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'state', select: 'name code' },
    { path: 'country', select: 'name code' },
  ];

  constructor(
    private readonly citiesRepository: CitiesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findPaginate(
    filter: FilterCitiesDto,
    cacheKey: string,
  ): Promise<PaginateResult<CityDocument>> {
    const cache =
      await this.cacheService.get<PaginateResult<CityDocument>>(cacheKey);

    if (cache) return cache;

    const result = await this.citiesRepository.findPaginate(filter, {
      sort: { name: 1 },
      populate: this.pathsPopulate,
    });

    await this.cacheService.set(cacheKey, result);

    return result;
  }
}
