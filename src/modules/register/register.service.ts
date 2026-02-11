import { Injectable } from '@nestjs/common';

import { InjectConnection } from '@nestjs/mongoose';

import { Connection } from 'mongoose';

import { Status, UserRole } from '@common/enums';

import { UsersService } from '@modules/users/users.service';
import { ModelsService } from '@modules/models/models.service';
import { ClientsService } from '@modules/clients/clients.service';

import { RegisterModelDto, RegisterClientDto } from './dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly usersService: UsersService,
    private readonly modelsService: ModelsService,
    private readonly clientsService: ClientsService,
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
          phone: registerModelDto.phone,
          status: Status.INACTIVE,
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

  async registerClient(registerClientDto: RegisterClientDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.usersService.create(
        {
          firstName: registerClientDto.firstName,
          lastName: registerClientDto.lastName,
          email: registerClientDto.email,
          password: registerClientDto.password,
          document: registerClientDto.document,
          documentType: registerClientDto.documentType,
          status: Status.INACTIVE,
          phone: registerClientDto.phone,
          roles: [UserRole.CLIENT],
        },
        session,
      );

      const client = await this.clientsService.create(
        {
          user: String(user._id),
          age: registerClientDto.age,
          city: registerClientDto.city,
          state: registerClientDto.state,
          country: registerClientDto.country,
        },
        session,
      );

      await session.commitTransaction();

      return client;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
