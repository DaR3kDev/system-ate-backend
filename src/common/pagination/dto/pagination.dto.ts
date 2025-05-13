// common/dtos/pagination.dto.ts

import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  search: string;
}
