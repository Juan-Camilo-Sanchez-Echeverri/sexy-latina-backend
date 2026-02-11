import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ClsService } from 'nestjs-cls';

import {
  ApiAuthResponses,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  Public,
  ApiNoContentResponseWrapper,
  Roles,
  ApiCreatedResponseWrapper,
  CurrentUser,
  AllRoles,
} from '@common/decorators';

import { StorageService } from '@modules/storage/storage.service';

import { OwnModelGuard } from '../guards';

import { CreateModelDto, UpdateModelDto, FilterModelDto } from '../dto';
import { EnsureUserIsModelPipe } from '../pipes/ensure-user-is-model.pipe';

import { ModelsService } from '../models.service';

import { ModelResponse } from '../responses';

import { ModelsErrors } from '../errors/models.errors';

import { ModelsExamples } from '../swagger/models.examples';

import { ROOT_PREFIX_MODELS } from '../constants/models.constants';

@Roles('ADMIN')
@ApiTags(ROOT_PREFIX_MODELS)
@Controller(ROOT_PREFIX_MODELS)
export class ModelsController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly storageService: StorageService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Create a new model profile
   *
   * @remarks Create a new model profile for the authenticated user.
   *
   */
  @Post()
  @ApiBearerAuth()
  @ApiAuthResponses()
  @ApiCreatedResponseWrapper(ModelResponse)
  @ApiValidationResponseWrapper(ModelsExamples.createModel)
  async create(@Body(EnsureUserIsModelPipe) createModelDto: CreateModelDto) {
    return await this.modelsService.create(createModelDto);
  }

  /**
   * Get all models
   *
   * @remarks Retrieve all model profiles with pagination.
   *
   */
  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiAuthResponses()
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: true })
  async findAll(@Query() params: FilterModelDto) {
    const cacheKey = this.createCacheKey();
    return await this.modelsService.findPaginate(params, cacheKey);
  }

  /**
   * Get all models
   *
   * @remarks Retrieve all verified model profiles with pagination.
   *
   */
  @Get('/public')
  @Public()
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: true })
  async findAllPublic(@Query() params: FilterModelDto) {
    params.data = { verified: true, ...params.data };
    const cacheKey = this.createCacheKey();
    return await this.modelsService.findPaginate(params, cacheKey);
  }

  /**
   * Get my model profile
   *
   * @remarks Retrieve the model profile of the authenticated user.
   *
   */
  @Get('/me')
  @AllRoles()
  @ApiBearerAuth()
  @ApiAuthResponses()
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  @ApiNotFoundResponseWrapper(ModelsErrors.MODEL_NOT_FOUND)
  async findMe(@CurrentUser('_id') userId: string) {
    return await this.modelsService.findOneByUserId(userId);
  }

  /**
   * Get a model by id
   *
   * @remarks Retrieve a specific model profile by its id.
   *
   */
  @Public()
  @Get(':id')
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  @ApiNotFoundResponseWrapper(ModelsErrors.MODEL_NOT_FOUND)
  async findOne(@Param('id') id: string) {
    return await this.modelsService.findOneById(id);
  }

  /**
   * Update a model profile
   *
   *
   * @remarks Update the model profile of the authenticated user.
   *
   */
  @Patch(':id')
  @ApiBearerAuth()
  @ApiAuthResponses()
  @UseGuards(OwnModelGuard)
  @ApiValidationResponseWrapper(ModelsExamples.updateModel)
  @ApiNotFoundResponseWrapper(ModelsErrors.MODEL_NOT_FOUND)
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
  ) {
    const model = await this.modelsService.findOneById(id);
    const modelUpdated = await this.modelsService.update(id, updateModelDto);

    if (model.profilePhoto && updateModelDto.profilePhoto === null) {
      await this.storageService.deleteFile(model.profilePhoto, 'local');
    }

    return modelUpdated;
  }

  /**
   * Delete a model profile
   *
   * @remarks Delete the model profile of the authenticated user.
   *
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiAuthResponses()
  @ApiNoContentResponseWrapper()
  @UseGuards(OwnModelGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponseWrapper(ModelsErrors.MODEL_NOT_FOUND)
  async remove(@Param('id') id: string) {
    return await this.modelsService.remove(id);
  }

  private createCacheKey(): string {
    const url = this.cls.get('url');

    return `${ROOT_PREFIX_MODELS}:${url}`;
  }
}
