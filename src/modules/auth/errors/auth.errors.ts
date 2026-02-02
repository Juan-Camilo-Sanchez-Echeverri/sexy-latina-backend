import { ErrorsResponse } from '@common/responses';

const code = 5000;

export const AuthErrors = {
  UNAUTHENTICATED_USER: {
    code: code,
    details: [
      {
        property: 'user',
        errors: ['Login is required to perform the requested action.'],
      },
    ],
  },

  TOKEN_NOT_FOUND: {
    code: code + 1,
    details: [
      {
        property: 'token',
        errors: ['Authentication token not sent'],
      },
    ],
  },

  TOKEN_EXPIRED: {
    code: code + 2,
    details: [
      {
        property: 'token',
        errors: ['Authentication token has expired'],
      },
    ],
  },

  INVALID_TOKEN: {
    code: code + 3,
    details: [
      {
        property: 'token',
        errors: ['Invalid authentication token'],
      },
    ],
  },

  USER_NOT_FOUND: {
    code: code + 4,
    details: [
      {
        property: 'user',
        errors: ['user not found.'],
      },
    ],
  },
  USER_EMAIL_NOT_FOUND: {
    code: code + 5,
    details: [
      {
        property: 'credentials',
        errors: ['The credentials are incorrect.'],
      },
    ],
  },

  PASSWORD_MISMATCH: {
    code: code + 6,
    details: [
      {
        property: 'credentials',
        errors: ['The credentials are incorrect.'],
      },
    ],
  },

  USER_INACTIVE: {
    code: code + 7,
    details: [
      {
        property: 'user',
        errors: ['The user is inactive.'],
      },
    ],
  },

  USER_DELETED: {
    code: code + 8,
    details: [
      {
        property: 'user',
        errors: ['user not found.'],
      },
    ],
  },

  EMAIL_NOT_FOUND: {
    code: code + 9,
    details: [
      {
        property: 'email',
        errors: ['No account exists with this email'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
