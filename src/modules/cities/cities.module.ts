import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatesModule } from '@modules/states/states.module';

import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

import { CitiesRepository } from './repositories/cities.repository';

import { City, CitySchema } from './schema/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
    ]),
    StatesModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService, CitiesRepository],
  exports: [CitiesService],
})
export class CitiesModule {}
