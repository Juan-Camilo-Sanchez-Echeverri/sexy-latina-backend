import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AddressModule } from '@modules/address/address.module';
import { UsersModule } from '@modules/users/users.module';

import { ModelsController, ModelsFilesController } from './controllers';

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
  ],
  controllers: [ModelsController, ModelsFilesController],
  providers: [ModelsService, ModelsRepository],
  exports: [ModelsService],
})
export class ModelsModule {}
