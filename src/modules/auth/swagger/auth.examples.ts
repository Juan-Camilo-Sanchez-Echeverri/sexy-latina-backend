import { ErrorsResponse } from '@common/responses';

export const AuthExamples = {
  login: {
    code: null,
    details: [
      {
        property: 'email',
        errors: ['email must be an email'],
      },
      {
        property: 'password',
        errors: ['password is not strong enough'],
      },
    ],
  },
  resetPassword: {
    code: null,
    details: [
      {
        property: 'token',
        errors: ['token should not be empty and is string'],
      },
      {
        property: 'email',
        errors: ['email must be an email'],
      },
      {
        property: 'password',
        errors: ['password is not strong enough'],
      },
    ],
  },
  recoverPassword: {
    code: null,
    details: [
      {
        property: 'email',
        errors: ['email must be an email'],
      },
    ],
  },
  activateAccount: {
    code: null,
    details: [
      {
        property: 'token',
        errors: ['token should not be empty and is string'],
      },
      {
        property: 'email',
        errors: ['email must be an email'],
      },
    ],
  },
} satisfies Record<string, ErrorsResponse>;
