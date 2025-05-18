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
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { PaginationSectorDto } from './dto/pagination-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSectorDto) {
    return await this.sectorsService.create(dto);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  async paginationSector(@Query() dto: PaginationSectorDto) {
    return await this.sectorsService.paginationSectors(dto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllSectors() {
    return await this.sectorsService.getAllSectors();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
    return await this.sectorsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.sectorsService.delete(id);
  }
}
