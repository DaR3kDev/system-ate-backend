import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Gender } from '@prisma/client';
import { EmptyToUndefined } from '../../common/validators/empty-transform.decorator';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

export class PaginationAffiliatesDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Gender)
  @EmptyToUndefined()
  gender?: Gender;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  sectorId?: string;
}
