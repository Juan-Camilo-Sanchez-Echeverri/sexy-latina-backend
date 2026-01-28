import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ApiOkResponseWrapper, Public } from '@common/decorators';

import { FilterCountryDto } from './dto';

import { CountriesService } from './countries.service';

import { CountryResponse } from './responses/country.response';

@Public()
@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

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
    return await this.countriesService.findPaginate(query);
  }
}
