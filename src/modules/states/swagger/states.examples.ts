import { ErrorsResponse } from '@common/responses';

export const StatesExamples = {
  invalidCountryId: {
    code: null,
    details: [
      {
        property: 'country',
        errors: ['country must be a mongodb id'],
      },
    ],
  },
} satisfies Record<string, ErrorsResponse>;
