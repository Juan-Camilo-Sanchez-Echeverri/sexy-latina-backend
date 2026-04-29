import { ServiceError } from '@common/responses';

export const ClientsExamples = {
  createClient: {
    code: 'invalid-user',
    message: 'Validation failed',
    details: {
      user: ['user must be a mongodb id'],
    },
  },
  updateClient: {
    code: 'invalid-age',
    message: 'Validation failed',
    details: {
      age: ['age must be at least 18'],
    },
  },
} satisfies Record<string, ServiceError>;
