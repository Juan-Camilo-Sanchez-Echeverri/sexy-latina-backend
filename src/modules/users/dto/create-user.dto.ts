import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsPassword } from '@common/decorators';

import { Status, UserRole } from '@common/enums';

import { UserDocumentType } from '../enums/user-document-type.enum';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  /**
   * The password of the user
   */
  @IsPassword()
  password: string;

  /**
   * The email of the user
   */
  @IsEmail()
  readonly email: string;

  /**
   * The phone of the user
   */
  @IsOptional()
  @IsString()
  readonly phone?: string;

  /**
   * The document number of the user
   */
  @IsOptional()
  @IsString()
  readonly document?: string;

  /**
   * The document type of the user
   */
  @IsOptional()
  @IsEnum(UserDocumentType)
  readonly documentType?: UserDocumentType;

  /**
   * The role of the user
   */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(UserRole, { each: true })
  readonly roles?: UserRole[];

  /**
   * The status of the user
   */
  @IsOptional()
  @IsEnum(Status)
  readonly status?: Status;
}
