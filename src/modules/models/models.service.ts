import { Injectable, NotFoundException } from '@nestjs/common';

import { PopulateOptions, PaginateResult } from 'mongoose';

import { ICrudService } from '@common/interfaces';

import { UserRole } from '@common/enums';

import { UsersService } from '@modules/users/users.service';

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
    private readonly usersService: UsersService,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<ModelDocument> {
    const { user, city, state, country, ...rest } = createModelDto;

    const userExists = await this.usersService.findOneBy({
      _id: user,
      roles: { $in: [UserRole.MODEL] },
    });

    if (!userExists) {
      throw new NotFoundException(ModelsErrors.USER_IS_NOT_A_MODEL);
    }

    const newModel = await this.modelsRepository.create({
      ...rest,
      user: user as unknown as ModelDocument['user'],
      city: city as unknown as ModelDocument['city'],
      state: state as unknown as ModelDocument['state'],
      country: country as unknown as ModelDocument['country'],
    });

    return this.populateModel(newModel);
  }

  async findPaginate(
    filter: FilterModelDto,
  ): Promise<PaginateResult<ModelDocument>> {
    return await this.modelsRepository.findPaginate(filter, {
      populate: this.pathsPopulate,
      sort: { createdAt: -1 },
    });
  }

  async findOneById(id: string): Promise<ModelDocument> {
    const model = await this.modelsRepository.findOneById(id);

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

  private async populateModel(doc: ModelDocument): Promise<ModelDocument> {
    return doc.populate(this.pathsPopulate);
  }
}
