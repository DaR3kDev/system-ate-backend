import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class PaginationUserDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol debe ser un valor válido: ADMIN o EMPLOYEE.',
  })
  role?: Role;
}
