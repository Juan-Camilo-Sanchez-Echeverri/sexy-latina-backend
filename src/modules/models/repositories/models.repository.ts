import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { Model, ModelDocument } from '../schemas/model.schema';

@Injectable()
export class ModelsRepository extends EntityRepository<ModelDocument> {
  constructor(
    @InjectModel(Model.name)
    protected readonly modelModel: PaginateModel<ModelDocument>,
  ) {
    super(modelModel);
  }
}
