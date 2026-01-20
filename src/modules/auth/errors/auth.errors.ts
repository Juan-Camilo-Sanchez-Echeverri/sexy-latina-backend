import { ErrorsResponse } from '@common/responses';

export const AuthErrors = {
  UNAUTHENTICATED_USER: {
    code: 8000,
    details: [
      {
        property: 'user',
        errors: ['Login is required to perform the requested action.'],
      },
    ],
  },

  TOKEN_NOT_FOUND: {
    code: 8001,
    details: [
      {
        property: 'token',
        errors: ['Authentication token not sent'],
      },
    ],
  },

  TOKEN_EXPIRED: {
    code: 8002,
    details: [
      {
        property: 'token',
        errors: ['Authentication token has expired'],
      },
    ],
  },

  INVALID_TOKEN: {
    code: 8003,
    details: [
      {
        property: 'token',
        errors: ['Invalid authentication token'],
      },
    ],
  },

  USER_NOT_FOUND: {
    code: 8004,
    details: [
      {
        property: 'user',
        errors: ['user not found.'],
      },
    ],
  },
  USER_EMAIL_NOT_FOUND: {
    code: 8100,
    details: [
      {
        property: 'credentials',
        errors: ['The credentials are incorrect.'],
      },
    ],
  },

  PASSWORD_MISMATCH: {
    code: 8101,
    details: [
      {
        property: 'credentials',
        errors: ['The credentials are incorrect.'],
      },
    ],
  },

  USER_INACTIVE: {
    code: 8102,
    details: [
      {
        property: 'user',
        errors: ['The user is inactive.'],
      },
    ],
  },

  USER_DELETED: {
    code: 8103,
    details: [
      {
        property: 'user',
        errors: ['user not found.'],
      },
    ],
  },

  EMAIL_NOT_FOUND: {
    code: 8200,
    details: [
      {
        property: 'email',
        errors: ['No account exists with this email'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
