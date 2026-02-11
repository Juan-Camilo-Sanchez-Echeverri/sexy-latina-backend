import { ErrorsResponse } from '@common/responses';

const code = 7000;

export const ClientsErrors = {
  NOT_FOUND: {
    code,
    details: [
      {
        property: null,
        errors: ['Client not found'],
      },
    ],
  },
  PROFILE_PHOTO_REQUIRED: {
    code: code + 1,
    details: [
      {
        property: 'profilePhoto',
        errors: ['profilePhoto file is required'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
