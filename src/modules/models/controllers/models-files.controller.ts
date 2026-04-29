import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import {
  AllRoles,
  ApiAuthResponses,
  ApiCreatedResponseWrapper,
  ApiNoContentResponseWrapper,
  ApiOkResponseWrapper,
  ApiBadRequestResponseWrapper,
} from '@common/decorators';

import { UploadInterceptor } from '@common/interceptors';

import { StorageService } from '@modules/storage/storage.service';

import { OwnModelGuard } from '../guards';

import { ModelsService } from '../models.service';

import { CreatePortfolioItemDto, UploadProfilePhotoDto } from '../dto';

import { ModelsErrors } from '../errors/models.errors';

import { ModelResponse } from '../responses';

@ApiBearerAuth()
@ApiAuthResponses()
@ApiTags('models')
@Controller('models')
export class ModelsFilesController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Updates the profile photo of a model.
   *
   * @remarks This method allows a model to update their profile photo.
   * The uploaded file must be an image (JPEG or PNG) and should not exceed 5 MB in size.
   *
   */
  @Put(':id/profile-photo')
  @AllRoles()
  @UseGuards(OwnModelGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadProfilePhotoDto })
  @ApiBadRequestResponseWrapper(ModelsErrors.PROFILE_PHOTO_REQUIRED)
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  @UploadInterceptor({
    type: 'single',
    fieldName: 'profilePhoto',
    maxSizeMB: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  })
  async updateProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() profilePhoto?: Express.Multer.File,
  ) {
    if (!profilePhoto) {
      throw new BadRequestException(ModelsErrors.PROFILE_PHOTO_REQUIRED);
    }

    const model = await this.modelsService.findOneById(id);

    if (model.profilePhoto) {
      await this.storageService.deleteFile(model.profilePhoto, 'local');
    }

    const folder = `uploads/models/${id}/profile-photo`;
    const pathProfilePhoto = await this.storageService.saveFile(
      profilePhoto,
      folder,
      'local',
    );

    return await this.modelsService.update(id, {
      profilePhoto: pathProfilePhoto,
    });
  }

  /**
   * Adds a new item to the model's portfolio.
   *
   * @remarks This method allows a model to add an item to its portfolio.
   *
   */
  @Post(':id/portfolio')
  @AllRoles()
  @UseGuards(OwnModelGuard)
  @ApiCreatedResponseWrapper(ModelResponse)
  @ApiBadRequestResponseWrapper(ModelsErrors.IMAGE_FILE_REQUIRED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePortfolioItemDto })
  @UploadInterceptor({
    type: 'multiple',
    fieldName: 'images',
    maxSizeMB: 5,
    maxCount: 10,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
  })
  async addPortafolioItem(
    @Param('id') id: string,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    if (!images?.length) throw new BadRequestException(ModelsErrors.IMAGE_FILE_REQUIRED);

    const folder = `uploads/models/${id}/portfolio`;

    const savedPaths = await Promise.all(
      images.map((image) => this.storageService.saveFile(image, folder, 'local')),
    );

    let model: any;
    for (const url of savedPaths) {
      model = await this.modelsService.addPortafolioItem(id, { url });
    }

    return model;
  }

  /**
   * Updates an existing portfolio item for the model.
   *
   * @remarks This method allows a model to update an item in its portfolio.
   *
   */
  @Put(':id/portfolio/:itemId')
  @AllRoles()
  @UseGuards(OwnModelGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePortfolioItemDto })
  @ApiBadRequestResponseWrapper(ModelsErrors.IMAGE_FILE_REQUIRED)
  @ApiOkResponseWrapper(ModelResponse, { isPaginate: false })
  @UploadInterceptor({
    type: 'single',
    fieldName: 'image',
    maxSizeMB: 5,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
  })
  async updatePortafolioItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException(ModelsErrors.IMAGE_FILE_REQUIRED);

    const item = await this.modelsService.getItemPortafolio(id, itemId);

    await this.storageService.deleteFile(item.url, 'local');
    const folder = `uploads/models/${id}/portfolio`;
    item.url = await this.storageService.saveFile(image, folder, 'local');

    return await this.modelsService.updatePortafolioItem(id, {
      _id: itemId,
      url: item.url,
    });
  }

  /**
   * Deletes a portfolio item from the model.
   *
   * @remarks This method allows a model to delete an item from its portfolio.
   *
   */
  @Delete(':id/portfolio/:itemId')
  @AllRoles()
  @ApiNoContentResponseWrapper()
  @UseGuards(OwnModelGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePortafolioItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    const urlItem = await this.modelsService.deletePortafolioItem(id, itemId);

    await this.storageService.deleteFile(urlItem, 'local');
  }
}
