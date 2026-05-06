import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Inject, forwardRef } from '@nestjs/common';

import {
  PopulateOptions,
  PaginateResult,
  ClientSession,
  QueryFilter,
} from 'mongoose';

import { ICrudService } from '@common/interfaces';

import { CacheService } from '@modules/cache/cache.service';
import { ClientsService } from '@modules/clients/clients.service';
import { UsersService } from '@modules/users/users.service';

import { CreateModelDto, FilterModelDto, UpdateModelDto } from './dto';

import { ModelsRepository } from './repositories/models.repository';

import { ModelDocument } from './schemas/model.schema';

import { ModelsErrors } from './errors/models.errors';

import { ROOT_PREFIX_MODELS } from './constants/models.constants';

@Injectable()
export class ModelsService implements ICrudService<ModelDocument> {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'city', select: 'name' },
    { path: 'state', select: 'name' },
    { path: 'country', select: 'name' },
    { path: 'user', select: 'name email phone' },
  ];

  constructor(
    private readonly modelsRepository: ModelsRepository,
    private readonly cacheService: CacheService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
  ) {}

  async findOneByUser(userId: string): Promise<ModelDocument | null> {
    return this.modelsRepository.findOne({ user: userId });
  }

  async create(
    createModelDto: CreateModelDto,
    session?: ClientSession,
  ): Promise<ModelDocument> {
    const { user, city, state, country } = createModelDto;

    const existingClient = await this.clientsService.findOneByUser(user);
    if (existingClient) {
      throw new ConflictException(ModelsErrors.USER_ALREADY_HAS_CLIENT);
    }

    const newModel = await this.modelsRepository.create(
      {
        ...createModelDto,
        user: user as unknown as ModelDocument['user'],
        city: city as unknown as ModelDocument['city'],
        state: state as unknown as ModelDocument['state'],
        country: country as unknown as ModelDocument['country'],
      },
      session,
    );

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_MODELS);

    return this.populateModel(newModel);
  }

  async findPaginate(
    filter: FilterModelDto,
    cacheKey: string,
  ): Promise<PaginateResult<ModelDocument>> {
    const cached =
      await this.cacheService.get<PaginateResult<ModelDocument>>(cacheKey);

    if (cached) return cached;

    filter.data = await this.buildFilterData(filter);

    const models = await this.modelsRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });

    await this.cacheService.set(cacheKey, models);

    return models;
  }

  private async buildFilterData(
    params: FilterModelDto,
  ): Promise<QueryFilter<ModelDocument>> {
    const where: Record<string, unknown> = { ...params.data };

    if (params.verified !== undefined) where.verified = params.verified;
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.nationality) where.nationality = params.nationality;
    if (params.category) where.categories = params.category;
    if (params.language) where.languages = params.language;
    if (params.city) where.city = params.city;
    if (params.state) where.state = params.state;
    if (params.country) where.country = params.country;

    if (params.minAge !== undefined || params.maxAge !== undefined) {
      const ageFilter: Record<string, number> = {};

      if (params.minAge !== undefined) ageFilter.$gte = params.minAge;
      if (params.maxAge !== undefined) ageFilter.$lte = params.maxAge;
      where.age = ageFilter;
    }

    if (params.name) {
      const userIds = await this.usersService.findIdsByName(params.name);
      where.user = { $in: userIds };
    }

    return where as QueryFilter<ModelDocument>;
  }

  async findOneById(id: string): Promise<ModelDocument> {
    const model = await this.modelsRepository.findOneById(id);

    if (!model) throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);

    return this.populateModel(model);
  }

  async findOneByUserId(userId: string): Promise<ModelDocument> {
    const model = await this.modelsRepository.findOne({ user: userId });

    if (!model) throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);

    return this.populateModel(model);
  }

  async update(
    id: string,
    updateModelDto: UpdateModelDto,
  ): Promise<ModelDocument> {
    const { user: userUpdate, ...modelData } = updateModelDto;

    const updatedModel = await this.modelsRepository.findByIdAndUpdate(
      id,
      modelData,
    );

    if (!updatedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    if (userUpdate) {
      const userField = updatedModel.user as unknown;
      let userIdStr: string;

      if (
        userField &&
        typeof userField === 'object' &&
        '_id' in (userField as Record<string, unknown>)
      ) {
        const uid = (userField as Record<string, unknown>)['_id'];
        userIdStr = typeof uid === 'string' ? uid : String(uid);
      } else {
        userIdStr = String(userField);
      }

      await this.usersService.update(userIdStr, userUpdate);
    }

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_MODELS);

    return this.populateModel(updatedModel);
  }

  async remove(id: string): Promise<ModelDocument> {
    const deletedModel = await this.modelsRepository.findByIdAndDelete(id);

    if (!deletedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_MODELS);

    return deletedModel;
  }

  async verify(id: string): Promise<ModelDocument> {
    const updatedModel = await this.modelsRepository.findByIdAndUpdate(id, {
      verified: true,
    });

    if (!updatedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    await this.cacheService.deleteByPrefix(ROOT_PREFIX_MODELS);

    return this.populateModel(updatedModel);
  }

  async getItemPortafolio(id: string, itemId: string) {
    const model = await this.findOneById(id);
    const item = model.portfolio.id(itemId);

    if (!item) {
      throw new NotFoundException(ModelsErrors.PORTFOLIO_ITEM_NOT_FOUND);
    }

    return item;
  }

  async addPortafolioItem(
    id: string,
    item: { url: string },
  ): Promise<ModelDocument> {
    const updatedModel = await this.modelsRepository.findByIdAndUpdate(id, {
      $push: { portfolio: item },
    });

    if (!updatedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    return this.populateModel(updatedModel);
  }

  async updatePortafolioItem(
    id: string,
    item: { _id: string; url: string },
  ): Promise<ModelDocument> {
    const modelUpdated = await this.modelsRepository.findOneAndUpdate(
      { _id: id, 'portfolio._id': item._id },
      { $set: { 'portfolio.$.url': item.url } },
    );

    if (!modelUpdated) {
      throw new NotFoundException(ModelsErrors.PORTFOLIO_ITEM_NOT_FOUND);
    }

    return this.populateModel(modelUpdated);
  }

  async deletePortafolioItem(id: string, itemId: string) {
    const item = await this.getItemPortafolio(id, itemId);

    await this.modelsRepository.findByIdAndUpdate(id, {
      $pull: { portfolio: { _id: itemId } },
    });

    return item.url;
  }

  private async populateModel(doc: ModelDocument): Promise<ModelDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
