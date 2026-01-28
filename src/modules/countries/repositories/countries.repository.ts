import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database/entity.repository';

import { Country, CountryDocument } from '../schemas/country.schema';

@Injectable()
export class CountriesRepository extends EntityRepository<CountryDocument> {
  constructor(
    @InjectModel(Country.name)
    protected readonly countryModel: PaginateModel<CountryDocument>,
  ) {
    super(countryModel);
  }
}
