import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ClsService } from 'nestjs-cls';

import {
  AllRoles,
  ApiAuthResponses,
  ApiBadRequestResponseWrapper,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiNotFoundResponseWrapper,
  ApiOkResponseWrapper,
  ApiValidationResponseWrapper,
  Roles,
} from '@common/decorators';

import { UploadInterceptor } from '@common/interceptors';

import { StorageService } from '@modules/storage/storage.service';

import { OwnClientGuard } from './guards';

import { ClientsService } from './clients.service';

import {
  CreateClientDto,
  FilterClientsDto,
  UpdateClientDto,
  UploadProfilePhotoDto,
} from './dto';

import { ClientResponse } from './responses/client.response';

import { ClientsErrors } from './errors/clients.errors';

import { ClientsExamples } from './swagger/clients.examples';

import { ROOT_PREFIX_CLIENTS } from './constants/clients.constants';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags(ROOT_PREFIX_CLIENTS)
@Controller(ROOT_PREFIX_CLIENTS)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly storageService: StorageService,
    private readonly cls: ClsService<{ url: string }>,
  ) {}

  /**
   * Create a new client profile
   *
   * @remarks Create a new client profile for the provided user.
   *
   */
  @Post()
  @Roles('ADMIN')
  @ApiCreatedResponseWrapper(ClientResponse)
  @ApiValidationResponseWrapper(ClientsExamples.createClient)
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  /**
   * Get all clients
   *
   * @remarks Retrieve all client profiles with pagination.
   */
  @Get()
  @AllRoles()
  @ApiOkResponseWrapper(ClientResponse, { isPaginate: true })
  async findAll(@Query() filter: FilterClientsDto) {
    const cacheKey = this.createCacheKey();
    return this.clientsService.findPaginate(filter, cacheKey);
  }

  /**
   * Get a client by id
   *
   * @remarks Retrieve a specific client profile by its id.
   */
  @Get(':id')
  @AllRoles()
  @UseGuards(OwnClientGuard)
  @ApiNotFoundResponseWrapper(ClientsErrors.NOT_FOUND)
  @ApiOkResponseWrapper(ClientResponse, { isPaginate: false })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOneById(id);
  }

  /**
   * Update a client profile
   *
   * @remarks Update the client profile data.
   */
  @Patch(':id')
  @AllRoles()
  @UseGuards(OwnClientGuard)
  @ApiNotFoundResponseWrapper(ClientsErrors.NOT_FOUND)
  @ApiValidationResponseWrapper(ClientsExamples.updateClient)
  @ApiOkResponseWrapper(ClientResponse, { isPaginate: false })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const client = await this.clientsService.findOneById(id);
    const clientUpdated = await this.clientsService.update(id, updateClientDto);

    if (client.profilePhoto && updateClientDto.profilePhoto === null) {
      await this.storageService.deleteFile(client.profilePhoto, 'local');
    }

    return clientUpdated;
  }

  /**
   * Delete a client by id
   *
   * @remarks Delete a specific client profile by its id.
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiNoContentResponseWrapper()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponseWrapper(ClientsErrors.NOT_FOUND)
  async remove(@Param('id') id: string): Promise<void> {
    await this.clientsService.remove(id);
  }

  /**
   * Upload or replace client profile photo
   *
   * @remarks Upload a profile photo for the given client id. If a photo
   * already exists it will be deleted before saving the new one.
   */
  @Patch(':id/profile-photo')
  @AllRoles()
  @UseGuards(OwnClientGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadProfilePhotoDto })
  @ApiBadRequestResponseWrapper(ClientsErrors.PROFILE_PHOTO_REQUIRED)
  @UploadInterceptor({
    type: 'single',
    fieldName: 'profilePhoto',
    maxSizeMB: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  })
  async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() profilePhoto?: Express.Multer.File,
  ) {
    if (!profilePhoto) {
      throw new BadRequestException(ClientsErrors.PROFILE_PHOTO_REQUIRED);
    }

    const client = await this.clientsService.findOneById(id);
    const previousProfilePhoto = client.profilePhoto;

    const folder = `uploads/clients/${id}/profile-photo`;
    const newPath = await this.storageService.saveFile(
      profilePhoto,
      folder,
      'local',
    );

    let updatedClient;
    try {
      updatedClient = await this.clientsService.updateProfilePhoto(id, newPath);
    } catch (error) {
      await this.storageService.deleteFile(newPath, 'local');

      throw error;
    }

    if (previousProfilePhoto) {
      await this.storageService.deleteFile(previousProfilePhoto, 'local');
    }

    return updatedClient;
  }

  private createCacheKey(): string {
    const url = this.cls.get('url');

    return `${ROOT_PREFIX_CLIENTS}:${url}`;
  }
}
