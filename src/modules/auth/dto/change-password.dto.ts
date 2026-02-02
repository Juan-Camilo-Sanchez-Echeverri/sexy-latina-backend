import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { IsPassword } from '@common/decorators';

@ValidatorConstraint({ name: 'Match' })
class MatchConstraint implements ValidatorConstraintInterface {
  validate = (value: string, args: ValidationArguments): boolean => {
    const relatedPropertyName = args.constraints[0] as keyof typeof args.object;
    const relatedValue = (args.object as Record<string, string>)[
      relatedPropertyName
    ];

    return value === relatedValue;
  };

  defaultMessage = (args: ValidationArguments): string => {
    const relatedPropertyName = args.constraints[0] as string;
    return `${args.property} must be equal to ${relatedPropertyName}`;
  };
}

const Match = (
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (target, propertyName) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

export class ChangePasswordDto {
  @IsPassword()
  currentPassword: string;

  @IsPassword()
  newPassword: string;

  @IsPassword()
  @Match('newPassword')
  confirmPassword: string;
}
