import { ServiceError } from '@common/responses';

export const EmailRequestErrors = {
  TOKEN_INVALID: {
    code: 'invalid-token',
    message: 'Email request token is invalid',
    details: { token: ['Email request token is invalid'] },
  },
  TOKEN_EXPIRED: {
    code: 'token-expired',
    message: 'Email request token expired',
    details: { token: ['Email request token expired'] },
  },
  MAX_ATTEMPTS_REACHED: {
    code: 'max-attempts-reached',
    message: 'Maximum number of attempts reached',
    details: { attempts: ['Maximum number of attempts reached'] },
  },
  REQUEST_NOT_FOUND_OR_EXPIRED: {
    code: 'request-not-found',
    message: 'Request not found or expired',
    details: { request: ['Request not found or expired'] },
  },
  COOLDOWN_ACTIVE: {
    code: 'cooldown-active',
    message: 'Please wait before requesting another email',
    details: { cooldown: ['Please wait before requesting another email'] },
  },
} as const satisfies Record<string, ServiceError>;
