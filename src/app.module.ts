import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { MongooseConfigService } from '@configs';

import { ParseMongoIdPipe } from '@common/pipes';

import { HttpExceptionFilter } from '@common/filters';

import { CommonModule } from '@common/common.module';

import { UsersModule } from '@modules/users/users.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { EmailRequestModule } from '@modules/email-request/email-request.module';
import { AddressModule } from '@modules/address/address.module';

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
    EventEmitterModule.forRoot(),
    CommonModule,

    //Business modules
    UsersModule,
    NotificationsModule,
    EmailRequestModule,
    AddressModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
