import { ServiceError } from '@common/responses';

export const UsersExamples: Record<string, ServiceError> = {
  conflictResponse: {
    code: 'invalid-email',
    message: 'There is already a registry with the same email',
    details: {
      email: ['There is already a registry with the same email : {email}'],
    },
  },
};
