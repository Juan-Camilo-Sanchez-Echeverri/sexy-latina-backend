import { IsOptional, IsUrl } from 'class-validator';

export class SocialLinksDto {
  @IsOptional()
  @IsUrl()
  readonly instagram?: string | null;

  @IsOptional()
  @IsUrl()
  readonly twitter?: string | null;
}
