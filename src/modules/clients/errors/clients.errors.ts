import { ServiceError } from '@common/responses';

export const ClientsErrors = {
  NOT_FOUND: {
    code: 'client-not-found',
    message: 'Client not found',
  },
  USER_ALREADY_HAS_MODEL: {
    code: 'user-already-has-model',
    message: 'This user already has a model profile.',
  },
  PROFILE_PHOTO_REQUIRED: {
    code: 'invalid-profile-photo',
    message: 'profilePhoto file is required',
    details: { profilePhoto: ['profilePhoto file is required'] },
  },
} as const satisfies Record<string, ServiceError>;
