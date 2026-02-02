import { Module } from '@nestjs/common';

import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { envs } from '@configs/envs.config';

import { EmailRequestModule } from '@modules/email-request/email-request.module';
import { UsersModule } from '@modules/users/users.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    EmailRequestModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: {
            expiresIn: envs.jwtExpiration as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
