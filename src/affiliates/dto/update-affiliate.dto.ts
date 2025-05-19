import { PartialType } from '@nestjs/mapped-types';
import { CreateAffiliateDto } from './create-affiliate.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { BooleanStringTransform } from '../../common/validators/boolean-string-transform.decorator';

export class UpdateAffiliateDto extends PartialType(CreateAffiliateDto) {
  @IsOptional()
  @IsBoolean()
  @BooleanStringTransform()
  isActive?: boolean;
}
