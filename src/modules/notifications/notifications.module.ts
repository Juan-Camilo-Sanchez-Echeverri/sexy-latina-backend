import { Global, Module } from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { EmailNotificationService } from './providers';

@Global()
@Module({
  providers: [NotificationsService, EmailNotificationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
