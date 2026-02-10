import { ApiProperty } from '@nestjs/swagger';

import { Allow } from 'class-validator';

export class CreatePortafolioItemDto {
  /**
   * The image file to upload.
   */
  @ApiProperty({ type: 'string', format: 'binary' })
  @Allow()
  image: string;
}
