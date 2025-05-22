import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { PaginationChildrenDto } from './dto/pagination-child.dto';
import { Autorization } from '../common/decorador/authorization.decorador';
import { Role } from '@prisma/client';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Autorization(Role.ADMIN, Role.EMPLOYEE)
  async create(@Body() dto: CreateChildDto) {
    return await this.childrenService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async pagination(@Query() dto: PaginationChildrenDto) {
    return await this.childrenService.paginationChildren(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.childrenService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Autorization(Role.ADMIN, Role.EMPLOYEE)
  async update(@Param('id') id: string, @Body() dto: CreateChildDto) {
    return await this.childrenService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Autorization(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return await this.childrenService.delete(id);
  }
}
