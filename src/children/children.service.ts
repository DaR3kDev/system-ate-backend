import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseHelper } from 'src/common/response/response.helper';
import { DatabaseService } from 'src/database/database.service';
import { CreateChildDto } from './dto/create-child.dto';
import { calculateAge } from 'src/common/utils/date.utils';
import { ChildResponse } from './interfaces/children-response.interfaces';
import { Children, Prisma } from '@prisma/client';
import { PaginationChildrenDto } from './dto/pagination-child.dto';
import { PaginatedResponse } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from 'src/common/pagination/pagination';

@Injectable()
export class ChildrenService {
  constructor(private readonly database: DatabaseService) {}

  async create(createChildDto: CreateChildDto): Promise<ResponseHelper<void>> {
    const { birth_date, parent_id, ...child } = createChildDto;
    const birthDate = new Date(birth_date);

    const existingChild = await this.database.children.findUnique({
      where: { dni: child.dni },
    });

    if (existingChild)
      throw new BadRequestException('El hijo ya existe en la base de datos');

    const existingParent = await this.database.affiliates.findUnique({
      where: { id: parent_id },
      include: { Children: true },
    });

    if (!existingParent)
      throw new BadRequestException('El padre ya tiene un hijo');

    await this.database.children.create({
      data: {
        ...child,
        affiliatesId: parent_id,
        birth_date: birthDate,
        age: calculateAge(birthDate),
      },
    });

    return new ResponseHelper<void>('Hijo creado exitosamente');
  }

  async update(
    id: string,
    updateChildDto: CreateChildDto,
  ): Promise<ResponseHelper<void>> {
    const { birth_date, parent_id, ...child } = updateChildDto;
    const birthDate = new Date(birth_date);

    const existingChild = await this.database.children.findUnique({
      where: { id },
    });

    if (!existingChild)
      throw new NotFoundException('El hijo no existe en la base de datos');

    await this.database.children.update({
      where: { id },
      data: {
        ...child,
        affiliatesId: parent_id,
        birth_date: birthDate,
        age: calculateAge(birthDate),
      },
    });

    return new ResponseHelper<void>('Hijo actualizado exitosamente');
  }

  async delete(id: string): Promise<ResponseHelper<void>> {
    const existingChild = await this.database.children.findUnique({
      where: { id },
    });

    if (!existingChild)
      throw new NotFoundException('El hijo no existe en la base de datos');

    await this.database.children.delete({
      where: { id },
    });

    return new ResponseHelper<void>('Hijo eliminado exitosamente');
  }

  async paginationChildren(
    paginationChildrenDto: PaginationChildrenDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Children>>>> {
    const { page, limit, search, gender, dni } = paginationChildrenDto;

    const where: Prisma.ChildrenWhereInput = {
      ...(search && {
        OR: [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(gender && { gender }),
      ...(dni && { dni: { contains: dni, mode: 'insensitive' } }),
    };

    const children = await this.database.children.findMany({
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      where,
    });

    const totalChildren = await this.database.children.count({ where });

    const safeChildren = children.map(
      ({
        id,
        dni,
        first_name,
        last_name,
        age,
        birth_date,
        has_disable,
        gender,
      }) => ({
        id,
        dni,
        first_name,
        last_name,
        age,
        birth_date,
        has_disable,
        gender,
      }),
    );

    const paginatedResponse = PaginationHelper.build(
      safeChildren,
      totalChildren,
      Number(page),
      Number(limit),
    );

    return new ResponseHelper<PaginatedResponse<Partial<Children>>>(
      'Niños obtenidos exitosamente',
      paginatedResponse,
    );
  }

  async findOne(id: string): Promise<ResponseHelper<ChildResponse>> {
    const child = await this.database.children.findUnique({
      where: { id },
    });

    if (!child)
      throw new NotFoundException('El hijo no existe en la base de datos');

    const {
      id: childId,
      dni,
      first_name,
      last_name,
      age,
      birth_date,
      has_disable,
      gender,
    } = child;

    const data: ChildResponse = {
      id: childId,
      dni,
      first_name,
      last_name,
      age,
      birth_date,
      has_disable,
      gender,
    };

    return new ResponseHelper<ChildResponse>(
      'Hijo obtenido exitosamente',
      data,
    );
  }
}
