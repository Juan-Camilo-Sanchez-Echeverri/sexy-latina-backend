import { ServiceError } from '@common/responses';

export const StatesExamples = {
  invalidCountryId: {
    code: 'invalid-country',
    message: 'Validation failed',
    details: {
      country: ['country must be a mongodb id'],
    },
  },
} satisfies Record<string, ServiceError>;
