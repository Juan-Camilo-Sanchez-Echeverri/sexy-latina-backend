import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import {
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  Public,
} from '@common/decorators';

import { ClsService } from 'nestjs-cls';

import { ROOT_PREFIX_STATES } from './constants/states.constants';

import { FilterStatesDto } from './dto';

import { FilterStatesPipe } from './pipes/filter-states.pipe';

import { StatesService } from './states.service';

import { StateResponse } from './responses/state.response';
import { CountryErrors } from '../countries/errors/countries.errors';
import { StatesExamples } from './swagger/states.examples';

@Public()
@ApiTags(ROOT_PREFIX_STATES)
@Controller(ROOT_PREFIX_STATES)
export class StatesController {
  constructor(
    private readonly statesService: StatesService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Get all states
   *
   * @remarks
   * This endpoint is public and can be accessed by anyone
   *
   * Allows to get all states filtered by country with pagination
   */
  @Get()
  @ApiNotFoundResponseWrapper(CountryErrors.NOT_FOUND)
  @ApiOkResponseWrapper(StateResponse, { isPaginate: true })
  @ApiValidationResponseWrapper(StatesExamples.invalidCountryId)
  async findByQuery(@Query(FilterStatesPipe) query: FilterStatesDto) {
    const cacheKey = this.createCacheKey();
    return await this.statesService.findPaginate(query, cacheKey);
  }

  private createCacheKey(): string {
    const url = this.cls.get('url');

    return `${ROOT_PREFIX_STATES}:${url}`;
  }
}
