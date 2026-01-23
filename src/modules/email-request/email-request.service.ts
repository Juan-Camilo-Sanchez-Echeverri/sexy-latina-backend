import { randomBytes } from 'node:crypto';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';

import { DateHelper } from '@common/helpers';
import { Events } from '@common/enums';

import {
  activateAccountTemplate,
  recoverPassword,
} from '@modules/notifications/templates/email';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';

import { EmailRequestDto, ValidateEmailRequest } from './dto';

import { TypeRequest } from './types/type-request';

import { EmailRequestErrors } from './errors/email-request.errors';

import { EmailRequestRepository } from './repositories/email-request.repository';

import { RequestType } from './schemas/email-request.schema';

interface DataEmailSend {
  email: string;
  token: string;
  firstName: string;
}

const MAX_ATTEMPTS = 3;
const COOLDOWN_MINUTES = 1;

interface EmailConfig {
  subject: string;
  template: (data: DataEmailSend) => string;
}

const EMAIL_CONFIGS: Record<TypeRequest, EmailConfig> = {
  recoverPassword: {
    subject: 'Recuperar contraseña',
    template: recoverPassword,
  },
  activeAccount: {
    subject: 'Activa tu cuenta',
    template: activateAccountTemplate,
  },
};

@Injectable()
export class EmailRequestService {
  constructor(
    private readonly emailRequestRepository: EmailRequestRepository,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async create(data: EmailRequestDto) {
    const { email, type, expiresIn, firstName } = data;

    const token = this.generateToken();

    const request = await this.emailRequestRepository.findOne({ email });

    const typeRequest = request?.requests.get(type);

    if (typeRequest) {
      this.validateAttempts(typeRequest);
      this.validateCooldown(typeRequest);
    }

    const update = {
      $set: {
        [`requests.${type}`]: {
          token,
          expiresIn,
        },
      },
      $inc: { [`requests.${type}.attempts`]: 1 },
    };

    await this.sendEmail(type, { email, token, firstName });

    await this.emailRequestRepository.findOneAndUpdate({ email }, update, {
      new: true,
      upsert: true,
    });
  }

  async validate(validateEmailRequest: ValidateEmailRequest) {
    const { email, token, type } = validateEmailRequest;

    const request = await this.emailRequestRepository.findOne({ email });
    const typeRequest = request?.requests.get(type);

    if (!request || !typeRequest || typeRequest.token !== token) {
      throw new NotFoundException(EmailRequestErrors.TOKEN_INVALID);
    }

    if (DateHelper.checkExpiration(typeRequest.expiresIn)) {
      throw new ConflictException(EmailRequestErrors.TOKEN_EXPIRED);
    }

    await this.emailRequestRepository.findOneAndUpdate(
      { email },
      { $unset: { [`requests.${type}`]: '' } },
    );
  }

  private validateCooldown(typeRequest: RequestType): void {
    const diff = DateHelper.diff(
      typeRequest.lastAttemptAt,
      DateHelper.getCurrentDate(),
      'minute',
    );

    if (diff < COOLDOWN_MINUTES) {
      throw new ConflictException(EmailRequestErrors.COOLDOWN_ACTIVE);
    }
  }

  private async sendEmail(type: TypeRequest, data: DataEmailSend) {
    const config = EMAIL_CONFIGS[type];
    if (!config) return;

    const dataEmail = {
      to: data.email,
      subject: config.subject,
      html: config.template(data),
    };

    return await this.eventEmitter.emitAsync(Events.EMAIL_SEND, dataEmail);
  }

  private validateAttempts(typeRequest: RequestType): void {
    if (typeRequest.attempts >= MAX_ATTEMPTS) {
      throw new ConflictException(EmailRequestErrors.MAX_ATTEMPTS_REACHED);
    }
  }

  private generateToken(): string {
    return randomBytes(20).toString('hex');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'cleanExpiredRequests' })
  async cleanExpiredRequests() {
    await this.emailRequestRepository.deleteMany({});
  }
}
