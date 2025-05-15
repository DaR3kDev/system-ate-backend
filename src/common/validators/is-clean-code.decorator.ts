import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCleanCodeConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const codeRegex = /^[a-zA-Z0-9]+$/; // solo letras y números
    return typeof value === 'string' && codeRegex.test(value);
  }

  defaultMessage(): string {
    return 'El código solo debe contener letras y números sin espacios ni caracteres especiales.';
  }
}

export function IsCleanCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCleanCodeConstraint,
    });
  };
}
