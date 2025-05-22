import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { Trim } from '../../common/validators/trim.decorator';
import { IsDateOnly } from '../../common/validators/is-date-only.decorator';
import { IsCuid } from '../../common/validators/is-cuid.decorator';
import { BooleanStringTransform } from '../../common/validators/boolean-string-transform.decorator';
import { Type } from 'class-transformer';

export class CreateChildDto {
  @IsNotEmpty()
  @IsString()
  @Trim()
  dni: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Trim()
  last_name: string;

  @IsNotEmpty()
  @IsDateOnly({
    message:
      'La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD',
  })
  birth_date: string;

  @IsNotEmpty()
  @IsBoolean()
  @BooleanStringTransform()
  has_disable: boolean;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: `El género debe ser uno de los siguientes: ${Object.values(Gender).join(', ')}`,
  })
  gender: Gender;

  @IsNotEmpty()
  @IsCuid()
  parent_id: string;
}
