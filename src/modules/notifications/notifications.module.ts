import { Module } from '@nestjs/common';

import { EmailRequestModule } from '@modules/email-request/email-request.module';

import { EmailProvider } from './providers';

import { NotificationsService } from './notifications.service';

import { EmailListener, UserListener } from './listeners';

@Module({
  imports: [EmailRequestModule],
  providers: [NotificationsService, EmailProvider, EmailListener, UserListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
