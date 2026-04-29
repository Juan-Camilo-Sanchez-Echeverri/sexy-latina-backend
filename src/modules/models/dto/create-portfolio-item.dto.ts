import { ApiProperty } from '@nestjs/swagger';

import { Allow } from 'class-validator';

export class CreatePortfolioItemDto {
  /**
   * Image or video files to upload (max 10).
   */
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @Allow()
  images: string[];
}
