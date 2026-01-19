import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigService } from '@configs';

@Module({
  imports: [
    // Módulos comunes globales
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
  ],
})
export class AppModule {}
