import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import {
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  Public,
} from '@common/decorators';

import { FilterStatesDto } from './dto';

import { FilterStatesPipe } from './pipes/filter-states.pipe';

import { StatesService } from './states.service';

import { StateResponse } from './responses/state.response';
import { CountryErrors } from '../countries/errors/countries.errors';
import { StatesExamples } from './swagger/states.examples';

@Public()
@ApiTags('states')
@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

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
    return await this.statesService.findPaginate(query);
  }
}
