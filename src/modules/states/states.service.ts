import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginateResult, PopulateOptions } from 'mongoose';

import { CacheService } from '@modules/cache/cache.service';

import { FilterStatesDto } from './dto';

import { StatesRepository } from './repositories/states.repository';

import { StateDocument } from './schemas/state.schema';
import { StateErrors } from './errors/states.errors';

@Injectable()
export class StatesService {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'country', select: 'name code' },
  ];

  constructor(
    private readonly statesRepository: StatesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findPaginate(
    filter: FilterStatesDto,
    cacheKey: string,
  ): Promise<PaginateResult<StateDocument>> {
    const cached =
      await this.cacheService.get<PaginateResult<StateDocument>>(cacheKey);

    if (cached) return cached;

    const result = await this.statesRepository.findPaginate(filter, {
      sort: { name: 1 },
      populate: this.pathsPopulate,
    });

    await this.cacheService.set(cacheKey, result);

    return result;
  }

  async findOneById(id: string): Promise<StateDocument> {
    const state = await this.statesRepository.findOneById(id);

    if (!state) throw new NotFoundException(StateErrors.NOT_FOUND);

    return this.populateState(state);
  }

  private populateState(state: StateDocument): Promise<StateDocument> {
    return state.populate(this.pathsPopulate);
  }
}
