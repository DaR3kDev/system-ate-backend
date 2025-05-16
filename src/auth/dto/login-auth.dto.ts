import { IsString, IsStrongPassword, Length } from 'class-validator';
import { IsCleanName } from '../../common/validators/is-clean-name.decorator';
import { Trim } from '../../common/validators/trim.decorator';

export class LoginAuthDto {
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
}
