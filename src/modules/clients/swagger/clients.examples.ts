import { ErrorsResponse } from '@common/responses';

export const ClientsExamples = {
  createClient: {
    code: null,
    details: [
      {
        property: 'user',
        errors: ['user must be a mongodb id'],
      },
    ],
  },
  updateClient: {
    code: null,
    details: [
      {
        property: 'age',
        errors: ['age must be at least 18'],
      },
    ],
  },
} satisfies Record<string, ErrorsResponse>;
