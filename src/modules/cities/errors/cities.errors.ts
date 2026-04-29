import { ServiceError } from '@common/responses';

export const CityErrors = {
  STATE_ERR: {
    code: 'invalid-state',
    message: 'The state does not belong to the country',
    details: { state: ['The state does not belong to the country'] },
  },
} as const satisfies Record<string, ServiceError>;
