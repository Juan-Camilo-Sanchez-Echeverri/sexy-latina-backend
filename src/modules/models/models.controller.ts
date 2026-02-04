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

import {
  ApiAuthResponses,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  Public,
  ApiNoContentResponseWrapper,
  Roles,
  ApiCreatedResponseWrapper,
} from '@common/decorators';

import { OwnModelGuard } from './guards';

import { CreateModelDto, UpdateModelDto, FilterModelDto } from './dto';

import { ModelsService } from './models.service';

import { ModelResponse } from './responses';

import { ModelsErrors } from './errors/models.errors';

import { ModelsExamples } from './swagger/models.examples';

@Roles('ADMIN')
@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

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
  async create(@Body() createModelDto: CreateModelDto) {
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
    return await this.modelsService.findPaginate(params);
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
    return await this.modelsService.findPaginate(params);
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
    return await this.modelsService.update(id, updateModelDto);
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
}
