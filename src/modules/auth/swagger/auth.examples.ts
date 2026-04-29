import { ServiceError } from '@common/responses';

export const AuthExamples = {
  login: {
    code: 'validation-error',
    message: 'Validation failed',
    details: {
      email: ['email must be an email'],
      password: ['password is not strong enough'],
    },
  },
  resetPassword: {
    code: 'validation-error',
    message: 'Validation failed',
    details: {
      token: ['token should not be empty and is string'],
      email: ['email must be an email'],
      password: ['password is not strong enough'],
    },
  },
  recoverPassword: {
    code: 'invalid-email',
    message: 'Validation failed',
    details: {
      email: ['email must be an email'],
    },
  },
  activateAccount: {
    code: 'validation-error',
    message: 'Validation failed',
    details: {
      token: ['token should not be empty and is string'],
      email: ['email must be an email'],
    },
  },
  resendActivation: {
    code: 'invalid-email',
    message: 'Validation failed',
    details: {
      email: ['email must be an email'],
    },
  },
} satisfies Record<string, ServiceError>;
