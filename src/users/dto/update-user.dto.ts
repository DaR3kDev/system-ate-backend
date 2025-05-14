import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { BooleanStringTransform } from '../../common/validators/boolean-string-transform.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  @BooleanStringTransform()
  isActive?: boolean;
}
