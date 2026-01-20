import { ErrorsResponse } from '@common/responses';

export const UsersExamples: Record<string, ErrorsResponse> = {
  conflictResponse: {
    code: null,
    details: [
      {
        property: 'email',
        errors: ['There is already a registry with the same email : {email}'],
      },
    ],
  },
};
