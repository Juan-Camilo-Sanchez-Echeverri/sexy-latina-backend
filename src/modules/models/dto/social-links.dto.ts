import { IsUrl } from 'class-validator';

export class SocialLinksDto {
  @IsUrl()
  readonly instagram: string | null;

  @IsUrl()
  readonly twitter: string | null;
}
