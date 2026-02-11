import { createHash } from 'node:crypto';

import type { Request } from 'express';

import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { ClsModule, ClsService } from 'nestjs-cls';

import { MongooseConfigService } from '@configs';

import { RolesGuard } from '@common/guards';

import { LoggerMiddleware } from '@common/middlewares';

import { AuthGuard } from '@modules/auth/guards/auth.guard';

import { ParseMongoIdPipe } from '@common/pipes';

import { HttpExceptionFilter } from '@common/filters';

import { CommonModule } from '@common/common.module';

import { UsersModule } from '@modules/users/users.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { EmailRequestModule } from '@modules/email-request/email-request.module';
import { AddressModule } from '@modules/address/address.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ModelsModule } from '@modules/models/models.module';
import { RegisterModule } from '@modules/register/register.module';
import { ClientsModule } from '@modules/clients/clients.module';

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
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup(cls: ClsService<{ url: string }>, req: Request) {
          if (req.method !== 'GET') return;

          const reqHash = createHash('sha256')
            .update(req.originalUrl)
            .digest('hex');

          cls.set('url', reqHash);
        },
      },
    }),
    CommonModule,

    //Business modules
    UsersModule,
    NotificationsModule,
    EmailRequestModule,
    AddressModule,
    AuthModule,
    ModelsModule,
    RegisterModule,
    ClientsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_PIPE, useClass: ParseMongoIdPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*splat}');
  }
}
