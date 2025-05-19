import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsCleanName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCleanName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          if (typeof value !== 'string') return false;
          const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return 'El nombre solo debe contener letras y espacios, sin caracteres especiales.';
        },
      },
    });
  };
}
