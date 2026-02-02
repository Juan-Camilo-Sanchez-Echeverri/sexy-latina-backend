import { ErrorsResponse } from '@common/responses';

const code = 3000;

export const CountryErrors = {
  NOT_FOUND: {
    code,
    details: [{ property: null, errors: ['This country does not exist'] }],
  },
} as const satisfies Record<string, ErrorsResponse>;
