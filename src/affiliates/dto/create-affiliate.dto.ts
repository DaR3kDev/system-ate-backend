import {
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  Length,
  IsEmail,
  Matches,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { Trim } from '../../common/validators/trim.decorator';
import { IsCleanName } from '../../common/validators/is-clean-name.decorator';
import { BooleanStringTransform } from '../../common/validators/boolean-string-transform.decorator';

export class CreateAffiliateDto {
  @IsString()
  @Trim()
  @Length(8, 15, {
    message: 'El DNI debe tener entre 8 y 15 caracteres.',
  })
  dni: string;

  @IsString()
  @Trim()
  @IsCleanName({
    message: 'El nombre solo debe contener letras sin caracteres especiales.',
  })
  @Length(2, 100, {
    message: 'El nombre debe tener entre 2 y 100 caracteres.',
  })
  name: string;

  @IsString()
  @Trim()
  @Matches(/^[0-9+()\s-]{7,20}$/, {
    message: 'El número de teléfono tiene un formato inválido.',
  })
  phone: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Correo electrónico inválido.',
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  @Trim()
  address?: string;

  @IsOptional()
  @IsBoolean()
  @BooleanStringTransform()
  has_child: boolean;

  @IsOptional()
  @IsBoolean()
  @BooleanStringTransform()
  has_disable: boolean;

  @IsEnum(Gender, {
    message: 'Género no válido. Debe ser MALE, FEMALE u OTHER.',
  })
  gender: Gender;

  @IsOptional()
  @IsString()
  sectorId?: string;
}
