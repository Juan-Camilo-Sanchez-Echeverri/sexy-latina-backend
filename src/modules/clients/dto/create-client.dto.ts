import { IsInt, IsMongoId, Min } from 'class-validator';

export class CreateClientDto {
  /**
   * User Id owner of the profile
   */
  @IsMongoId()
  user: string;

  /**
   * Age
   *
   * @example 25
   */
  @IsInt()
  @Min(18)
  readonly age: number;

  /**
   * City
   */
  @IsMongoId()
  readonly city: string;

  /**
   * State
   */
  @IsMongoId()
  readonly state: string;

  /**
   * Country
   */
  @IsMongoId()
  readonly country: string;
}
