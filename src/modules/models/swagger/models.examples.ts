import { ServiceError } from '@common/responses';

export const ModelsExamples = {
  createModel: {
    code: 'validation-error',
    message: 'Validation failed',
    details: {
      age: ['age must be at least 18'],
      city: ['city must be a mongodb id'],
      state: ['state must be a mongodb id'],
      country: ['country must be a mongodb id'],
    },
  },
  updateModel: {
    code: 'validation-error',
    message: 'Validation failed',
    details: {
      age: ['age must be at least 18'],
      categories: ['each value in categories must be a valid enum value'],
    },
  },
} satisfies Record<string, ServiceError>;
