import { Events } from '../enums';
import type { EmailPayload } from '@modules/notifications/interfaces';
import type { UserDocument } from '@modules/users/schemas/user.schema';

export interface EventPayloads {
  [Events.EMAIL_SEND]: EmailPayload;
  [Events.USER_CREATED]: UserDocument;
}
