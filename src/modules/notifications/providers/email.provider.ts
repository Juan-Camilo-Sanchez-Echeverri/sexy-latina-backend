import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { INotificationProvider } from '../interfaces/notification.interface';
import { EmailPayload } from '../interfaces/email-payload.interface';
import { emailConfig } from '../config';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class EmailProvider implements INotificationProvider<EmailPayload> {
  readonly type = NotificationType.EMAIL;
  private readonly logger = new Logger(EmailProvider.name);

  async send(payload: EmailPayload): Promise<boolean> {
    try {
      const response = await fetch(emailConfig.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: emailConfig.from,
          to: payload.to,
          subject: payload.subject,
          body: payload.html,
          doc_type: 'text/html',
        }),
      });

      const data = await response.json();

      if (data.message !== 'email send') {
        throw new Error(data.message);
      }

      return true;
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new InternalServerErrorException('Error sending mail');
    }
  }
}
