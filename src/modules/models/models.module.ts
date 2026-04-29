import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AddressModule } from '@modules/address/address.module';
import { UsersModule } from '@modules/users/users.module';
import { ClientsModule } from '@modules/clients/clients.module';

import { ModelsController, ModelsFilesController, PublicModelsController } from './controllers';

import { ModelsService } from './models.service';
import { ModelsRepository } from './repositories/models.repository';
import { Model, ModelSchema } from './schemas/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Model.name,
        schema: ModelSchema,
      },
    ]),
    AddressModule,
    UsersModule,
    forwardRef(() => ClientsModule),
  ],
  controllers: [ModelsController, ModelsFilesController, PublicModelsController],
  providers: [ModelsService, ModelsRepository],
  exports: [ModelsService],
})
export class ModelsModule {}
