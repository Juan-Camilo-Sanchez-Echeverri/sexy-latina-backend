import { ServiceError } from '@common/responses';

export const UsersErrors = {
  USER_NOT_FOUND: {
    code: 'user-not-found',
    message: 'User not found',
  },
} as const satisfies Record<string, ServiceError>;
