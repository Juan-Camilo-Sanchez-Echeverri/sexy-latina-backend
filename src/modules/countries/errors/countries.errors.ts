import { ServiceError } from '@common/responses';

export const CountryErrors = {
  NOT_FOUND: {
    code: 'country-not-found',
    message: 'This country does not exist',
  },
} as const satisfies Record<string, ServiceError>;
