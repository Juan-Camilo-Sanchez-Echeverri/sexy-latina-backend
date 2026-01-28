import { applyDecorators } from '@nestjs/common';

import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ErrorsResponse } from '../../responses';

import { AuthErrors } from '@modules/auth/errors/auth.errors';

const DETAILS_SCHEMA: SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      property: { oneOf: [{ type: 'string' }, { type: 'null' }] },
      errors: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
};

const ERROR_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    code: { type: 'number' },
    status: { type: 'number' },
    path: { type: 'string' },
    details: DETAILS_SCHEMA,
  },
};

const ERROR_NULL_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    code: { type: 'null' },
    status: { type: 'number' },
    path: { type: 'string' },
    details: DETAILS_SCHEMA,
  },
};

export const ApiAuthResponses = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized (missing or invalid token)',
      schema: ERROR_SCHEMA,
      examples: {
        missingToken: {
          summary: 'No token provided',
          value: AuthErrors.TOKEN_NOT_FOUND,
        },
        invalidToken: {
          summary: 'Malformed token',
          value: AuthErrors.INVALID_TOKEN,
        },
        expiredToken: {
          summary: 'Token has expired',
          value: AuthErrors.TOKEN_EXPIRED,
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden (insufficient role)',
      schema: ERROR_NULL_SCHEMA,

      example: {
        code: null,
        message: 'Forbidden resource',
      },
    }),
  );
};

export const ApiNotFoundResponseWrapper = (example: ErrorsResponse) => {
  return ApiNotFoundResponse({
    description: 'Not Found (resource not found)',
    schema: ERROR_SCHEMA,
    example: {
      error: 'NotFound',
      status: 404,
      path: '/api/v1.0/',
      ...example,
    },
  });
};

export const ApiConflictResponseWrapper = (example: ErrorsResponse) => {
  return ApiConflictResponse({
    description: 'Conflict – duplicate resource or business rule violation',
    schema: ERROR_NULL_SCHEMA,
    example: {
      error: 'Conflict',
      status: 409,
      path: '/api/v1.0/',
      ...example,
    },
  });
};

export const ApiValidationResponseWrapper = (example: ErrorsResponse) => {
  return ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity – validation failed',
    schema: ERROR_NULL_SCHEMA,
    example: {
      error: 'UnprocessableEntity',
      status: 422,
      path: '/api/v1.0/',
      ...example,
    },
  });
};
