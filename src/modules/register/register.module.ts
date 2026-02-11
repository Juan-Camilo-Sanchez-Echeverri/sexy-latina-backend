import { Module } from '@nestjs/common';

import { UsersModule } from '@modules/users/users.module';
import { ModelsModule } from '@modules/models/models.module';
import { ClientsModule } from '@modules/clients/clients.module';

import { RegisterController } from './register.controller';

import { RegisterService } from './register.service';

@Module({
  imports: [UsersModule, ModelsModule, ClientsModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
