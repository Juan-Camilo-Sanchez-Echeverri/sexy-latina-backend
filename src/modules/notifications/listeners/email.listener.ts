import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { Events } from '@common/enums';

import type { EmailPayload } from '../interfaces';

import { NotificationType } from '../enums/notification-type.enum';

import { NotificationsService } from '../notifications.service';

@Injectable()
export class EmailListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(Events.EMAIL_SEND, { async: true })
  async sendEmail(data: EmailPayload) {
    await this.notificationsService.send(NotificationType.EMAIL, data);
  }
}
