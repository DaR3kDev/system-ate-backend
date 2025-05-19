import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Sectors } from '@prisma/client';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { PaginationSectorDto } from './dto/pagination-sector.dto';
import { DatabaseService } from '../database/database.service';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from '../common/pagination/pagination';

@Injectable()
export class SectorsService {
  constructor(private readonly database: DatabaseService) {}

  async create(
    createSectorDto: CreateSectorDto,
  ): Promise<ResponseHelper<void>> {
    const { name, code } = createSectorDto;
    const normalizedName = name.toUpperCase();
    const normalizedCode = code.toUpperCase();

    if (
      await this.database.sectors.findUnique({
        where: { name: normalizedName },
      })
    )
      throw new BadRequestException('El nombre ya existe');

    if (
      await this.database.sectors.findUnique({
        where: { code: normalizedCode },
      })
    )
      throw new BadRequestException('El código ya existe');

    await this.database.sectors.create({
      data: {
        name: normalizedName,
        code: normalizedCode,
      },
    });

    return new ResponseHelper<void>('Sector creado exitosamente');
  }

  async update(
    id: string,
    updateSectorDto: UpdateSectorDto,
  ): Promise<ResponseHelper<void>> {
    const { name, code } = updateSectorDto;

    const normalizedName = name?.toUpperCase();
    const normalizedCode = code?.toUpperCase();

    const existingByName = await this.database.sectors.findFirst({
      where: {
        name: normalizedName,
        NOT: { id },
      },
    });

    if (existingByName) throw new BadRequestException('El nombre ya existe');

    const existingByCode = await this.database.sectors.findFirst({
      where: {
        code: normalizedCode,
        NOT: { id },
      },
    });

    if (existingByCode) throw new BadRequestException('El código ya existe');

    await this.database.sectors.update({
      where: { id },
      data: {
        name: normalizedName,
        code: normalizedCode,
      },
    });

    return new ResponseHelper<void>('Sector actualizado exitosamente');
  }

  async delete(id: string): Promise<ResponseHelper<void>> {
    await this.database.sectors.delete({
      where: { id },
    });

    return new ResponseHelper<void>('Sector eliminado exitosamente');
  }

  async paginationSectors(
    paginationSectorDto: PaginationSectorDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Sectors>>>> {
    const { page, limit, search, code } = paginationSectorDto;

    const where: Prisma.SectorsWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(code && { code: { equals: code } }),
    };

    const sectors = await this.database.sectors.findMany({
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      where,
    });

    const totalSectors = await this.database.sectors.count({ where });

    const paginatedResponse = PaginationHelper.build(
      sectors,
      totalSectors,
      Number(page),
      Number(limit),
    );

    return new ResponseHelper<PaginatedResponse<Partial<Sectors>>>(
      'Sectores obtenidos exitosamente',
      paginatedResponse,
    );
  }

  async getAllSectors(): Promise<ResponseHelper<Partial<Sectors>[]>> {
    const sectors = await this.database.sectors.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return new ResponseHelper<Partial<Sectors>[]>(
      'Sectores obtenidos exitosamente',
      sectors,
    );
  }
}
