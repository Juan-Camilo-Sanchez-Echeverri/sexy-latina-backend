import { ServiceError } from '@common/responses';

export const AuthErrors = {
  UNAUTHENTICATED_USER: {
    code: 'unauthorized',
    message: 'Login is required to perform the requested action.',
  },

  TOKEN_NOT_FOUND: {
    code: 'token-not-found',
    message: 'Authentication token not sent',
  },

  TOKEN_EXPIRED: {
    code: 'token-expired',
    message: 'Authentication token has expired',
  },

  INVALID_TOKEN: {
    code: 'invalid-token',
    message: 'Invalid authentication token',
  },

  USER_NOT_FOUND: {
    code: 'user-not-found',
    message: 'User not found.',
  },

  USER_EMAIL_NOT_FOUND: {
    code: 'invalid-credentials',
    message: 'The credentials are incorrect.',
  },

  PASSWORD_MISMATCH: {
    code: 'invalid-credentials',
    message: 'The credentials are incorrect.',
  },

  USER_INACTIVE: {
    code: 'user-inactive',
    message: 'The user is inactive.',
  },

  USER_DELETED: {
    code: 'user-not-found',
    message: 'User not found.',
  },

  EMAIL_NOT_FOUND: {
    code: 'email-not-found',
    message: 'No account exists with this email',
  },
} as const satisfies Record<string, ServiceError>;
