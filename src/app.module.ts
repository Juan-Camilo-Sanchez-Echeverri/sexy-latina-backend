import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import { MongooseConfigService } from '@configs';

import { ParseMongoIdPipe } from '@common/pipes';

import { HttpExceptionFilter } from '@common/filters';

import { CommonModule } from '@common/common.module';

import { UsersModule } from '@modules/users/users.module';

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
    CommonModule,

    //Business modules
    UsersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
