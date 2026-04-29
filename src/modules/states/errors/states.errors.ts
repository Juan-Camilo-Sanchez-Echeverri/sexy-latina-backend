import { ServiceError } from '@common/responses';

export const StateErrors = {
  NOT_FOUND: {
    code: 'state-not-found',
    message: 'State not found',
  },
} as const satisfies Record<string, ServiceError>;
