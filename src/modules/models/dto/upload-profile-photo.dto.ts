import { ApiProperty } from '@nestjs/swagger';

export class UploadProfilePhotoDto {
  /**
   * The profile photo file to upload.
   */
  @ApiProperty({ type: 'string', format: 'binary' })
  profilePhoto: Express.Multer.File;
}
