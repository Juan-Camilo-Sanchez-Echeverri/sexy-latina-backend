import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { CountriesController } from './countries.controller';

import { CountriesService } from './countries.service';

import { CountriesRepository } from './repositories/countries.repository';

import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Country.name,
        schema: CountrySchema,
      },
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, CountriesRepository],
  exports: [CountriesService],
})
export class CountriesModule {}
