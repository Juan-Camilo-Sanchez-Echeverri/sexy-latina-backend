import { APP_GUARD, APP_PIPE } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';

import { MongooseConfigService } from '@configs';

import { ParseMongoIdPipe } from '@common/pipes';

@Module({
  imports: [
    // Módulos comunes globales
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 50,
          ttl: seconds(60),
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
  ],
})
export class AppModule {}
