import { Controller, Get, Param, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ClsService } from 'nestjs-cls';

import {
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  Public,
} from '@common/decorators';

import { FilterModelDto } from '../dto';

import { ModelsService } from '../models.service';

import { ModelResponse } from '../responses';

import { ModelsErrors } from '../errors/models.errors';

import { ROOT_PREFIX_MODELS } from '../constants/models.constants';

@Public()
@ApiTags(ROOT_PREFIX_MODELS)
@Controller(`public/${ROOT_PREFIX_MODELS}`)
export class PublicModelsController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Get all public models
   *
   * @remarks Retrieve all verified model profiles with pagination.
   *
   */
  @Get()
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: true })
  async findAll(@Query() params: FilterModelDto) {
    params.verified = true;
    params.isActive = true;
    const cacheKey = `${ROOT_PREFIX_MODELS}:${this.cls.get('url')}`;
    return await this.modelsService.findPaginate(params, cacheKey);
  }

  /**
   * Get a model by id
   *
   * @remarks Retrieve a specific model profile by its id.
   *
   */
  @Get(':id')
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  @ApiNotFoundResponseWrapper(ModelsErrors.MODEL_NOT_FOUND)
  async findOne(@Param('id') id: string) {
    return await this.modelsService.findOneById(id);
  }
}
