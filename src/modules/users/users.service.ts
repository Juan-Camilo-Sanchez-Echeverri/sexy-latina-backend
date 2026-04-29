import { Injectable, NotFoundException } from '@nestjs/common';

import { ClientSession, PopulateOptions } from 'mongoose';

import { envs } from '@configs';

import { ICrudService } from '@common/interfaces';

import { Status, Events, UserRole } from '@common/enums';
import { bcryptAdapter } from '@common/adapters';

import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';

import { UsersRepository } from './repositories/users.repository';

import { UserDocument } from './schemas/user.schema';

import { UsersErrors } from './errors/users.errors';

@Injectable()
export class UsersService implements ICrudService<UserDocument> {
  private readonly pathsPopulate: PopulateOptions[] = [];

  async onModuleInit() {
    const existingUser = await this.usersRepository.findOne({});

    if (!existingUser) {
      await this.create({
        name: envs.defaultUserName,
        email: envs.defaultUserEmail,
        password: envs.defaultUserPassword,
        phone: envs.defaultUserPhone,
        document: envs.defaultUserDocument,
        documentType: envs.defaultUserDocumentType,
        roles: [UserRole.ADMIN],
        status: Status.ACTIVE,
      });
    }
  }

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const hashedPassword = await bcryptAdapter.hash(createUserDto.password);

    const newUser = await this.usersRepository.create(
      {
        ...createUserDto,
        password: hashedPassword,
      },
      session,
    );

    const populatedUser = await this.populateUser(newUser);

    await this.eventEmitter.emitAsync(Events.USER_CREATED, populatedUser);

    return populatedUser;
  }

  async findPaginate(filter: FilterUsersDto) {
    return await this.usersRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });
  }

  async findByQuery(filter: FilterUsersDto['data']) {
    return await this.usersRepository.find(
      filter,
      {},
      { populate: this.pathsPopulate },
    );
  }

  async findOneById(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!user) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return this.populateUser(user);
  }

  async findOneBy(query: FilterUsersDto['data']): Promise<UserDocument | null> {
    return await this.usersRepository.findOne(query);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcryptAdapter.hash(updateUserDto.password);
    }

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: id, status: Status.ACTIVE },
      updateUserDto,
    );

    if (!updatedUser) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return this.populateUser(updatedUser);
  }

  async remove(id: string): Promise<UserDocument> {
    const deletedUser = await this.usersRepository.findOneAndDelete({
      _id: id,
      status: Status.ACTIVE,
    });

    if (!deletedUser) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return deletedUser;
  }

  async count(query: FilterUsersDto['data']): Promise<number> {
    return this.usersRepository.count(query);
  }

  async findIdsByName(name: string): Promise<string[]> {
    const regex = new RegExp(name, 'i');
    const users = await this.usersRepository.find(
      { name: regex },
      { _id: 1 },
    );
    return users.map((u) => u._id.toString());
  }

  async updateStatus(id: string, status: Status): Promise<UserDocument> {
    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: id },
      { status },
    );

    if (!updatedUser) throw new NotFoundException(UsersErrors.USER_NOT_FOUND);

    return this.populateUser(updatedUser);
  }

  private async populateUser(doc: UserDocument): Promise<UserDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
