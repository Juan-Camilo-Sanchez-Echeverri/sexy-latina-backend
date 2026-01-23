import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Status, Events } from '@common/enums';
import { DateHelper } from '@common/helpers';
import type { UserDocument } from '@modules/users/schemas/user.schema';
import { EmailRequestService } from '@modules/email-request/email-request.service';

@Injectable()
export class UserListener {
  constructor(private readonly emailRequestService: EmailRequestService) {}

  @OnEvent(Events.USER_CREATED, { async: true })
  async handleUserCreated(user: UserDocument) {
    if (user.status !== Status.INACTIVE) {
      return;
    }

    await this.emailRequestService.create({
      email: user.email,
      firstName: user.firstName,
      type: 'activeAccount',
      expiresIn: DateHelper.add(DateHelper.getCurrentDate(), 1, 'hour'),
    });
  }
}
