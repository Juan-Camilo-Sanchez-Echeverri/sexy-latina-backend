import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

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
      const transporter = nodemailer.createTransport({
        ...emailConfig.smtp,
        secure: true,
      });

      const mailOptions: Options = {
        from: emailConfig.smtp.auth.user,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      };

      const response = await transporter.sendMail(mailOptions);

      this.logger.debug(`Response: ${JSON.stringify(response)}`);

      return true;
    } catch (error) {
      this.logger.error('Error sending email:', error);

      throw new InternalServerErrorException('Error sending mail');
    }
  }
}
