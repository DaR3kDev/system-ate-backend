import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { Role } from '@prisma/client';
import { Autorization } from '../common/decorador/authorization.decorador';
import { GetUserId } from '../common/decorador/get-user-id.decorator';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { PaginationAffiliatesDto } from './dto/pagination-affiliates.dto';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Autorization(Role.ADMIN, Role.EMPLOYEE)
  async create(@GetUserId() userId: string, @Body() dto: CreateAffiliateDto) {
    return await this.affiliatesService.create(userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async paginationAffiliate(@Query() dto: PaginationAffiliatesDto) {
    return await this.affiliatesService.paginationAffiliate(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.affiliatesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Autorization(Role.ADMIN, Role.EMPLOYEE)
  async update(
    @Param('id') id: string,
    @GetUserId() userId: string,
    @Body() dto: UpdateAffiliateDto,
  ) {
    return await this.affiliatesService.update(id, userId, dto);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @Autorization(Role.ADMIN, Role.EMPLOYEE)
  async toggleActive(@Param('id') id: string) {
    return await this.affiliatesService.toggleActive(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Autorization(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.affiliatesService.remove(id);
  }
}
