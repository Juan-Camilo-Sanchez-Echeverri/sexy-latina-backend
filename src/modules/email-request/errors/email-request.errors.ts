import { ErrorsResponse } from '@common/responses';

const code = 6000;

export const EmailRequestErrors = {
  TOKEN_INVALID: {
    code: code,
    details: [
      {
        property: 'token',
        errors: ['Email request token is invalid'],
      },
    ],
  },
  TOKEN_EXPIRED: {
    code: code + 1,
    details: [
      {
        property: 'token',
        errors: ['Email request token expired'],
      },
    ],
  },
  MAX_ATTEMPTS_REACHED: {
    code: code + 2,
    details: [
      {
        property: 'attempts',
        errors: ['Maximum number of attempts reached'],
      },
    ],
  },
  REQUEST_NOT_FOUND_OR_EXPIRED: {
    code: code + 3,
    details: [
      {
        property: 'request',
        errors: ['Request not found or expired'],
      },
    ],
  },
  COOLDOWN_ACTIVE: {
    code: code + 4,
    details: [
      {
        property: 'cooldown',
        errors: ['Please wait before requesting another email'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
