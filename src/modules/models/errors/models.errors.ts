import { ServiceError } from '@common/responses';

export const ModelsErrors = {
  MODEL_NOT_FOUND: {
    code: 'model-not-found',
    message: 'Model not found.',
  },
  USER_IS_NOT_A_MODEL: {
    code: 'invalid-user',
    message: 'The user is not a model.',
    details: { user: ['The user is not a model.'] },
  },
  PORTFOLIO_ITEM_NOT_FOUND: {
    code: 'portfolio-item-not-found',
    message: 'Portfolio item not found.',
    details: { portfolio: ['Portfolio item not found.'] },
  },
  PROFILE_PHOTO_REQUIRED: {
    code: 'invalid-profile-photo',
    message: 'profilePhoto file is required',
    details: { profilePhoto: ['profilePhoto file is required'] },
  },
  IMAGE_FILE_REQUIRED: {
    code: 'invalid-image',
    message: 'image file is required',
    details: { image: ['image file is required'] },
  },
  USER_ALREADY_HAS_CLIENT: {
    code: 'user-already-has-client',
    message: 'This user already has a client profile.',
  },
} as const satisfies Record<string, ServiceError>;
