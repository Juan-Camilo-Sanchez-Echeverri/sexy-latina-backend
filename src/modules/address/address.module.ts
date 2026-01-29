import { Module } from '@nestjs/common';

import { CitiesModule } from '@modules/cities/cities.module';
import { StatesModule } from '@modules/states/states.module';
import { CountriesModule } from '@modules/countries/countries.module';

@Module({
  imports: [CountriesModule, StatesModule, CitiesModule],
  exports: [CountriesModule, StatesModule, CitiesModule],
})
export class AddressModule {}
