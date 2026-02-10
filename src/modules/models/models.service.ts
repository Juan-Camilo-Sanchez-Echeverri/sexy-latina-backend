import { Injectable, NotFoundException } from '@nestjs/common';

import { PopulateOptions, PaginateResult, ClientSession } from 'mongoose';

import { ICrudService } from '@common/interfaces';

import { CacheService } from '@modules/cache/cache.service';

import { CreateModelDto, FilterModelDto, UpdateModelDto } from './dto';

import { ModelsRepository } from './repositories/models.repository';

import { ModelDocument } from './schemas/model.schema';

import { ModelsErrors } from './errors/models.errors';

@Injectable()
export class ModelsService implements ICrudService<ModelDocument> {
  private readonly pathsPopulate: PopulateOptions[] = [
    { path: 'city', select: 'name' },
    { path: 'state', select: 'name' },
    { path: 'country', select: 'name' },
    { path: 'user', select: 'firstName lastName phone' },
  ];

  constructor(
    private readonly modelsRepository: ModelsRepository,
    private readonly cacheService: CacheService,
  ) {}

  async create(
    createModelDto: CreateModelDto,
    session?: ClientSession,
  ): Promise<ModelDocument> {
    const { user, city, state, country } = createModelDto;

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

    return this.populateModel(newModel);
  }

  async findPaginate(
    filter: FilterModelDto,
    cacheKey: string,
  ): Promise<PaginateResult<ModelDocument>> {
    const cached =
      await this.cacheService.get<PaginateResult<ModelDocument>>(cacheKey);

    if (cached) return cached;

    const models = await this.modelsRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });

    await this.cacheService.set(cacheKey, models);

    return models;
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
    const updatedModel = await this.modelsRepository.findByIdAndUpdate(
      id,
      updateModelDto,
    );

    if (!updatedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    return this.populateModel(updatedModel);
  }

  async remove(id: string): Promise<ModelDocument> {
    const deletedModel = await this.modelsRepository.findByIdAndDelete(id);

    if (!deletedModel) {
      throw new NotFoundException(ModelsErrors.MODEL_NOT_FOUND);
    }

    return deletedModel;
  }

  async getItemPortafolio(id: string, itemId: string) {
    const model = await this.findOneById(id);
    const item = model.portafolio.id(itemId);

    if (!item) {
      throw new NotFoundException(ModelsErrors.PORTAFOLIO_ITEM_NOT_FOUND);
    }

    return item;
  }

  async addPortafolioItem(
    id: string,
    item: { url: string },
  ): Promise<ModelDocument> {
    const updatedModel = await this.modelsRepository.findByIdAndUpdate(id, {
      $push: { portafolio: item },
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
      { _id: id, 'portafolio._id': item._id },
      { $set: { 'portafolio.$.url': item.url } },
    );

    if (!modelUpdated) {
      throw new NotFoundException(ModelsErrors.PORTAFOLIO_ITEM_NOT_FOUND);
    }

    return this.populateModel(modelUpdated);
  }

  async deletePortafolioItem(id: string, itemId: string) {
    const item = await this.getItemPortafolio(id, itemId);

    await this.modelsRepository.findByIdAndUpdate(id, {
      $pull: { portafolio: { _id: itemId } },
    });

    return item.url;
  }

  private async populateModel(doc: ModelDocument): Promise<ModelDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
