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
  PORTAFOLIO_ITEM_NOT_FOUND: {
    code: code + 2,
    details: [
      {
        property: 'portafolio',
        errors: ['Portafolio item not found.'],
      },
    ],
  },
  PROFILE_PHOTO_REQUIRED: {
    code: code + 3,
    details: [
      {
        property: 'profilePhoto',
        errors: ['profilePhoto file is required'],
      },
    ],
  },
  IMAGE_FILE_REQUIRED: {
    code: code + 4,
    details: [
      {
        property: 'image',
        errors: ['image file is required'],
      },
    ],
  },
} as const satisfies Record<string, ErrorsResponse>;
