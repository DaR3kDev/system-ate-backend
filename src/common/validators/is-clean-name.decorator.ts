import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCleanName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCleanName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^[A-Za-z]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'El nombre solo debe contener letras sin espacios ni caracteres especiales.';
        },
      },
    });
  };
}
