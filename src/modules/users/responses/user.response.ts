import { OmitType } from '@nestjs/swagger';

import { User } from '../schemas/user.schema';

export class UserResponse extends OmitType(User, ['password'] as const) {
  /**
   *  Identifier for the user.
   */
  _id: string;
}
