import { Injectable } from '@nestjs/common';

import { InjectConnection } from '@nestjs/mongoose';

import { Connection } from 'mongoose';

import { Status, UserRole } from '../../common/enums';

import { UsersService } from '@modules/users/users.service';
import { ModelsService } from '@modules/models/models.service';

import { RegisterModelDto } from './dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly modelsService: ModelsService,
  ) {}

  async registerModel(registerModelDto: RegisterModelDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.usersService.create(
        {
          firstName: registerModelDto.firstName,
          lastName: registerModelDto.lastName,
          email: registerModelDto.email,
          password: registerModelDto.password,
          document: registerModelDto.document,
          documentType: registerModelDto.documentType,
          status: Status.INACTIVE,
          phone: registerModelDto.phone,
          roles: [UserRole.MODEL],
        },
        session,
      );

      const model = await this.modelsService.create(
        {
          user: String(user._id),
          age: registerModelDto.age,
          city: registerModelDto.city,
          state: registerModelDto.state,
          country: registerModelDto.country,
          socialLinks: registerModelDto.socialLinks,
          availability: registerModelDto.availability,
          services: registerModelDto.services,
          nationality: registerModelDto.nationality,
          languages: registerModelDto.languages,
          categories: registerModelDto.categories,
          description: registerModelDto.description,
          height: registerModelDto.height,
        },
        session,
      );

      await session.commitTransaction();

      return model;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
