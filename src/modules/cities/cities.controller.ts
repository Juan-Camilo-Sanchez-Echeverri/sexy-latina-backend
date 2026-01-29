import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import {
  ApiBadRequestResponseWrapper,
  ApiOkResponseWrapper,
  Public,
} from '@common/decorators';

import { ROOT_PREFIX_CITIES } from './constants/cities.constants';

import { FilterCitiesPipe } from './pipes/filter-cities.pipe';

import { FilterCitiesDto } from './dto';

import { CitiesService } from './cities.service';

import { CityErrors } from './errors/cities.errors';

import { CityResponse } from './responses/city.response';
import { ClsService } from 'nestjs-cls';

@Public()
@ApiTags(ROOT_PREFIX_CITIES)
@Controller(ROOT_PREFIX_CITIES)
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Get all cities
   *
   * @remarks
   * This endpoint is public and can be accessed by anyone
   *
   * Allows to get all cities filtered by state and country with pagination
   */
  @Get()
  @ApiBadRequestResponseWrapper(CityErrors.STATE_ERR)
  @ApiOkResponseWrapper(CityResponse, { isPaginate: true })
  async findByQuery(@Query(FilterCitiesPipe) filter: FilterCitiesDto) {
    const cacheKey = this.createCacheKey();
    return await this.citiesService.findPaginate(filter, cacheKey);
  }

  private createCacheKey() {
    const url = this.cls.get('url');

    return `${ROOT_PREFIX_CITIES}:${url}`;
  }
}
