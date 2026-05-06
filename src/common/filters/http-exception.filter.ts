import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ErrorsResponse } from '../responses/errors.response';
import { ValidationErrorDetails } from '../interfaces/validation-error.interface';

import { envs } from '@configs';

import { ExecModes } from '@common/enums';

import { LogService } from '@modules/log/log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  async catch(
    exception: Error | HttpException,
    host: ArgumentsHost,
  ): Promise<Response> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isInternalServerError = Math.floor(status / 100) === 5;
    const isProdEnvironment = envs.nodeEnv !== ExecModes.LOCAL;

    if (isInternalServerError && isProdEnvironment) {
      await this.logService.sendDiscordLog(request, status, exception);
    }

    if (isInternalServerError || !isProdEnvironment) {
      this.logService.errorLog(exception);
    }

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const details = this.extractDetails(exceptionResponse);
    const message = this.resolveMessage(exceptionResponse, details);
    const code = this.extractCode(exceptionResponse, exception, details);

    const responseBody: ErrorsResponse = {
      code,
      status,
      message,
    };

    return response.status(status).json(responseBody);
  }

  private resolveMessage(
    response: string | object,
    details: ValidationErrorDetails,
  ): string {
    const firstField = Object.keys(details)[0];
    if (firstField) {
      return details[firstField][0];
    }
    if (typeof response === 'object' && 'message' in response) {
      return response.message as string;
    }
    return typeof response === 'string' ? response : 'Internal server error';
  }

  private extractDetails(response: string | object): ValidationErrorDetails {
    if (typeof response === 'object' && 'details' in response) {
      return response.details as ValidationErrorDetails;
    }
    return {};
  }

  private extractCode(
    response: string | object,
    exception: Error | HttpException,
    details: ValidationErrorDetails,
  ): string {
    if (typeof response === 'object' && 'code' in response && response.code) {
      return response.code as string;
    }

    const fields = Object.keys(details);
    if (fields.length === 1) {
      return `invalid-${this.toKebab(fields[0])}`;
    }
    if (fields.length > 1) {
      return 'validation-error';
    }

    const name = exception.constructor.name.replace(/Exception$/, '');
    if (name === 'Http') return 'internal-server-error';
    return name.replace(/([A-Z])/g, (_match: string, l: string, i: number) => {
      return (i > 0 ? '-' : '') + l.toLowerCase();
    });
  }

  private toKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
}
