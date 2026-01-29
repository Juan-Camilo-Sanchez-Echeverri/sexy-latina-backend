import { ErrorsResponse } from '@common/responses';

const code = 4000;

export const CityErrors = {
  STATE_ERR: {
    code,
    details: [
      {
        property: null,
        errors: ['The state does not belong to the country'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
