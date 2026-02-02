import { ErrorsResponse } from '@common/responses';

const code = 1000;

export const UsersErrors = {
  USER_NOT_FOUND: {
    code: code,
    details: [{ property: null, errors: ['User not found'] }],
  },
} as const satisfies Record<string, ErrorsResponse>;
