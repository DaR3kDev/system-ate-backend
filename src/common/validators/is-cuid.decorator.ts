import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCuid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments): boolean {
          return typeof value === 'string' && /^c[a-z0-9]{24}$/.test(value);
        },
        defaultMessage(): string {
          return 'The value must be a valid cuid (e.g., c123abc456def789ghi012jk)';
        },
      },
    });
  };
}
