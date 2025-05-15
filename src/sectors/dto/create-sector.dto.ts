import { IsString, Length } from 'class-validator';
import { IsCleanName } from '../../common/validators/is-clean-name.decorator';
import { Trim } from '../../common/validators/trim.decorator';
import { IsCleanCode } from '../../common/validators/is-clean-code.decorator';

export class CreateSectorDto {
  @IsString()
  @Trim()
  @IsCleanName({
    message:
      'El nombre solo debe contener letras sin espacios ni caracteres especiales.',
  })
  @Length(1, 255)
  name: string;

  @IsString()
  @Trim()
  @IsCleanCode({
    message:
      'El código solo debe contener letras y números sin espacios ni caracteres especiales.',
  })
  @Length(1, 50)
  code: string;
}
