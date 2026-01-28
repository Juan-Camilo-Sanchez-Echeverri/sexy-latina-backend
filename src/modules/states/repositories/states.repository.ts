import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { State, StateDocument } from '../schemas/state.schema';

@Injectable()
export class StatesRepository extends EntityRepository<StateDocument> {
  constructor(
    @InjectModel(State.name)
    protected readonly stateModel: PaginateModel<StateDocument>,
  ) {
    super(stateModel);
  }
}
