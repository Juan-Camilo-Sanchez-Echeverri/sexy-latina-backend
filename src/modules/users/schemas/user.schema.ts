import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseSchema } from '@common/database';
import { Status, UserRole } from '@common/enums';

import { UserDocumentType } from '../enums/user-document-type.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
  strict: 'throw',
  strictQuery: 'throw',
})
export class User extends BaseSchema {
  @Prop()
  name?: string;

  /**
   * Password of the user used for authentication.
   * Should be stored securely (hashed).
   */
  @Prop({ required: true })
  password: string;

  /**
   * Email address of the user.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Phone number of the user.
   */
  @Prop()
  phone?: string;

  /**
   * Type of document used for user identification.
   */
  @Prop({
    enum: UserDocumentType,
    type: String,
  })
  documentType?: UserDocumentType;

  /**
   * Document number used for user identification.
   */
  @Prop()
  document?: string;

  /**
   * Roles assigned to the user in the system.
   */
  @Prop({ default: [] })
  roles: UserRole[];

  /**
   * Current status of the user in the system.
   */
  @Prop({ enum: Status, default: Status.INACTIVE, type: String })
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const result = { ...ret };
    delete (result as Partial<User>).password;
    return result;
  },
});
