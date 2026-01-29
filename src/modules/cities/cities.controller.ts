import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import {
  ApiBadRequestResponseWrapper,
  ApiOkResponseWrapper,
  Public,
} from '@common/decorators';

import { FilterCitiesPipe } from './pipes/filter-cities.pipe';

import { FilterCitiesDto } from './dto';

import { CitiesService } from './cities.service';

import { CityErrors } from './errors/cities.errors';

import { CityResponse } from './responses/city.response';

@Public()
@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

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
  async findByQuery(@Query(FilterCitiesPipe) body: FilterCitiesDto) {
    return await this.citiesService.findPaginate(body);
  }
}
