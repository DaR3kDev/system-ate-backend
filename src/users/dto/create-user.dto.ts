import {
  IsString,
  IsEnum,
  IsStrongPassword,
  Length,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';
import { Trim } from '../../common/validators/trim.decorator';
import { IsCleanName } from '../../common/validators/is-clean-name.decorator';
import { Match } from '../../common/validators/match.decorator';

export class CreateUserDto {
  @IsString()
  @Trim()
  @IsCleanName({
    message:
      'El nombre solo debe contener letras sin espacios ni caracteres especiales.',
  })
  @Length(2, 50, {
    message: 'El nombre debe tener entre 2 y 50 caracteres.',
  })
  username: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.',
    },
  )
  password: string;

  @IsString()
  @Match('password', {
    message: 'La confirmación de contraseña no coincide.',
  })
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role, {
    message: 'Rol no válido. Debe ser ADMIN o EMPLEADO.',
  })
  role?: Role;
}
