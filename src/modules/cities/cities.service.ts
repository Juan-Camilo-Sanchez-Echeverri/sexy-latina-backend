import { Injectable } from '@nestjs/common';

import type { PaginateResult, PopulateOptions } from 'mongoose';

import { FilterCitiesDto } from './dto';

import { CityDocument } from './schema/city.schema';

import { CitiesRepository } from './repositories/cities.repository';

@Injectable()
export class CitiesService {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'state', select: 'name code' },
    { path: 'country', select: 'name code' },
  ];

  constructor(private readonly citiesRepository: CitiesRepository) {}

  async findPaginate(
    filter: FilterCitiesDto,
  ): Promise<PaginateResult<CityDocument>> {
    return await this.citiesRepository.findPaginate(filter, {
      sort: { name: 1 },
      populate: this.pathsPopulate,
    });
  }
}
