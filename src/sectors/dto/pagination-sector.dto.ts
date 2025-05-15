import { IsString, Length } from 'class-validator';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { IsCleanCode } from '../../common/validators/is-clean-code.decorator';
import { Trim } from '../../common/validators/trim.decorator';

export class PaginationSectorDto extends PaginationDto {
  @IsString()
  @Trim()
  @IsCleanCode({
    message:
      'El código solo debe contener letras y números sin espacios ni caracteres especiales.',
  })
  @Length(1, 50)
  code: string;
}
