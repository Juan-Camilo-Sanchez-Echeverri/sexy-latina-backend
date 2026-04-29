import { ValidationError } from 'class-validator';

import { ValidationErrorDetails } from '../interfaces/validation-error.interface';

export const getClassValidatorErrors = (
  validationErrors: ValidationError[],
  parentProperty = '',
): ValidationErrorDetails => {
  const details: ValidationErrorDetails = {};

  collectErrors(validationErrors, details, parentProperty);

  return details;
};

const collectErrors = (
  validationErrors: ValidationError[],
  details: ValidationErrorDetails,
  parentProperty = '',
): void => {
  for (const error of validationErrors) {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    if (error.constraints) {
      details[propertyPath] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      collectErrors(error.children, details, propertyPath);
    }
  }
};
