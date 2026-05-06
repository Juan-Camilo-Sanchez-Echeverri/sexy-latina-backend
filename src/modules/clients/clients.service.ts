import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ClientSession, PaginateResult, PopulateOptions } from 'mongoose';

import { Inject, forwardRef } from '@nestjs/common';

import { ICrudService } from '@common/interfaces';

import { CacheService } from '@modules/cache/cache.service';
import { ModelsService } from '@modules/models/models.service';

import { CreateClientDto, FilterClientsDto, UpdateClientDto } from './dto';

import { ClientsRepository } from './repositories/clients.repository';

import { ClientDocument } from './schemas/client.schema';

import { ClientsErrors } from './errors/clients.errors';

import { ROOT_PREFIX_CLIENTS } from './constants/clients.constants';

@Injectable()
export class ClientsService implements ICrudService<ClientDocument> {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly cacheService: CacheService,
    @Inject(forwardRef(() => ModelsService))
    private readonly modelsService: ModelsService,
  ) {}

  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'city', select: 'name' },
    { path: 'state', select: 'name' },
    { path: 'country', select: 'name' },
    { path: 'user', select: 'name phone' },
  ];

  async findOneByUser(userId: string): Promise<ClientDocument | null> {
    return this.clientsRepository.findOne({ user: userId });
  }

  async create(
    createClientDto: CreateClientDto,
    session?: ClientSession,
  ): Promise<ClientDocument> {
    const { user, city, state, country } = createClientDto;

    const existingModel = await this.modelsService.findOneByUser(user);
    if (existingModel) {
      throw new ConflictException(ClientsErrors.USER_ALREADY_HAS_MODEL);
    }

    const client = await this.clientsRepository.create(
      {
        ...createClientDto,
        user: user as unknown as ClientDocument['user'],
        city: city as unknown as ClientDocument['city'],
        state: state as unknown as ClientDocument['state'],
        country: country as unknown as ClientDocument['country'],
      },
      session,
    );

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_CLIENTS);

    return this.populateClient(client);
  }

  async findOneById(id: string): Promise<ClientDocument> {
    const client = await this.clientsRepository.findOneById(id);

    if (!client) throw new NotFoundException(ClientsErrors.NOT_FOUND);

    return this.populateClient(client);
  }

  async findPaginate(
    filter: FilterClientsDto,
    cacheKey: string,
  ): Promise<PaginateResult<ClientDocument>> {
    const cached =
      await this.cacheService.get<PaginateResult<ClientDocument>>(cacheKey);

    if (cached) return cached;

    const clients = await this.clientsRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });

    await this.cacheService.set(cacheKey, clients);

    return clients;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientDocument> {
    const updated = await this.clientsRepository.findByIdAndUpdate(
      id,
      updateClientDto,
    );

    if (!updated) throw new NotFoundException(ClientsErrors.NOT_FOUND);

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_CLIENTS);

    return this.populateClient(updated);
  }

  async remove(id: string): Promise<ClientDocument> {
    const deleted = await this.clientsRepository.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException(ClientsErrors.NOT_FOUND);

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_CLIENTS);

    return deleted;
  }

  async updateProfilePhoto(id: string, path: string): Promise<ClientDocument> {
    const updated = await this.clientsRepository.findByIdAndUpdate(id, {
      profilePhoto: path,
    });

    if (!updated) throw new NotFoundException(ClientsErrors.NOT_FOUND);

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_CLIENTS);

    return this.populateClient(updated);
  }

  private populateClient(client: ClientDocument): Promise<ClientDocument> {
    return client.populate(this.pathsPopulate);
  }
}
