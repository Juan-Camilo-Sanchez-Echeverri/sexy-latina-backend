import { ErrorsResponse } from '@common/responses';

export const ModelsExamples = {
  createModel: {
    code: null,
    details: [
      {
        property: 'age',
        errors: ['age must be at least 18'],
      },
      {
        property: 'city',
        errors: ['city must be a mongodb id'],
      },
      {
        property: 'state',
        errors: ['state must be a mongodb id'],
      },
      {
        property: 'country',
        errors: ['country must be a mongodb id'],
      },
    ],
  },
  updateModel: {
    code: null,
    details: [
      {
        property: 'age',
        errors: ['age must be at least 18'],
      },
      {
        property: 'categories',
        errors: ['each value in categories must be a valid enum value'],
      },
    ],
  },
} satisfies Record<string, ErrorsResponse>;
