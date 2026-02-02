import { ErrorsResponse } from '@common/responses';
const code = 2000;

export const StateErrors = {
  NOT_FOUND: {
    code,
    details: [{ property: null, errors: ['State not found'] }],
  },
} as const satisfies Record<string, ErrorsResponse>;
