import { ErrorsResponse } from '@common/responses';

const code = 6000;

export const ModelsErrors = {
  MODEL_NOT_FOUND: {
    code: code,
    details: [
      {
        property: null,
        errors: ['Model not found.'],
      },
    ],
  },
  USER_IS_NOT_A_MODEL: {
    code: code + 1,
    details: [
      {
        property: 'user',
        errors: ['The user is not a model.'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
