import { Module, forwardRef } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@modules/users/users.module';
import { ModelsModule } from '@modules/models/models.module';

import { ClientsController } from './clients.controller';

import { ClientsService } from './clients.service';

import { ClientsRepository } from './repositories/clients.repository';

import { Client, ClientSchema } from './schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
    UsersModule,
    forwardRef(() => ModelsModule),
  ],
  providers: [ClientsService, ClientsRepository],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
