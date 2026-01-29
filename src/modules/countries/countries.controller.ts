import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ClsService } from 'nestjs-cls';

import { ApiOkResponseWrapper, Public } from '@common/decorators';

import { ROOT_PREFIX_COUNTRIES } from './constants/countries.constants';

import { FilterCountryDto } from './dto';

import { CountriesService } from './countries.service';

import { CountryResponse } from './responses/country.response';

@Public()
@ApiTags(ROOT_PREFIX_COUNTRIES)
@Controller(ROOT_PREFIX_COUNTRIES)
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Get all countries
   *
   * @remarks
   * This endpoint is public and can be accessed by anyone
   *
   * Allows to get all countries
   */
  @Get()
  @ApiOkResponseWrapper(CountryResponse, { isPaginate: true })
  async findPaginate(@Query() query: FilterCountryDto) {
    const cacheKey = this.createCacheKey();
    return await this.countriesService.findPaginate(query, cacheKey);
  }

  private createCacheKey(): string {
    const url = this.cls.get('url');

    return `${ROOT_PREFIX_COUNTRIES}:${url}`;
  }
}
