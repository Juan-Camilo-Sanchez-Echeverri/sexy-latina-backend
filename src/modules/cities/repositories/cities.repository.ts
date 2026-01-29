import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { City, CityDocument } from '../schema/city.schema';

@Injectable()
export class CitiesRepository extends EntityRepository<CityDocument> {
  constructor(@InjectModel(City.name) model: PaginateModel<CityDocument>) {
    super(model);
  }
}
