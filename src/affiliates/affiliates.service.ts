import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { ResponseHelper } from '../common/response/response.helper';
import { Affiliates, Prisma } from '@prisma/client';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { PaginationAffiliatesDto } from './dto/pagination-affiliates.dto';
import { PaginatedResponse } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from 'src/common/pagination/pagination';
import { AffiliateResponse } from './interfaces/affiliate-response.interface';

@Injectable()
export class AffiliatesService {
  constructor(private readonly database: DatabaseService) {}

  async create(
    userId: string,
    createAffiliateDto: CreateAffiliateDto,
  ): Promise<ResponseHelper<void>> {
    const { dni, sectorId, has_child, has_disable } = createAffiliateDto;

    const existingAffiliate = await this.database.affiliates.findUnique({
      where: { dni },
    });

    if (existingAffiliate)
      throw new ConflictException('El DNI ya está registrado.');

    const sectorExists = await this.database.sectors.findUnique({
      where: { id: sectorId },
    });

    if (!sectorExists) throw new BadRequestException('El sector no existe.');

    await this.database.affiliates.create({
      data: {
        ...createAffiliateDto,
        has_child: has_child ?? false,
        has_disable: has_disable ?? false,
        sectorId,
        userId,
      },
    });

    return new ResponseHelper<void>('Afiliado creado exitosamente');
  }

  async update(
    id: string,
    userId: string,
    updateAffiliateDto: UpdateAffiliateDto,
  ): Promise<ResponseHelper<void>> {
    const { dni, sectorId, has_child, has_disable } = updateAffiliateDto;

    const affiliate = await this.database.affiliates.findUnique({
      where: { id },
    });

    if (!affiliate) throw new BadRequestException('El afiliado no existe.');

    if (dni && dni !== affiliate.dni) {
      const duplicate = await this.database.affiliates.findUnique({
        where: { dni },
      });

      if (duplicate && duplicate.id !== id)
        throw new ConflictException('El DNI ya está registrado.');
    }

    if (sectorId) {
      const sectorExists = await this.database.sectors.findUnique({
        where: { id: sectorId },
      });

      if (!sectorExists) throw new BadRequestException('El sector no existe.');
    }

    await this.database.affiliates.update({
      where: { id },
      data: {
        ...updateAffiliateDto,
        has_child: has_child ?? false,
        has_disable: has_disable ?? false,
        sectorId,
        userId,
      },
    });

    return new ResponseHelper<void>('Afiliado actualizado exitosamente');
  }

  async toggleActive(id: string): Promise<ResponseHelper<void>> {
    const user = await this.database.affiliates.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    const updatedAffiliates = await this.database.affiliates.update({
      where: { id },
      data: {
        is_active: !user.is_active,
      },
    });

    return new ResponseHelper<void>(
      updatedAffiliates.is_active
        ? 'Afiliado activado exitosamente'
        : 'Afiliado desactivado exitosamente',
    );
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    await this.database.affiliates.delete({
      where: { id },
    });

    return new ResponseHelper<void>('Afiliado eliminado exitosamente');
  }

  async paginationAffiliate(
    paginationAffiliatesDto: PaginationAffiliatesDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Affiliates>>>> {
    const { page, limit, search, gender, dni, sectorId } =
      paginationAffiliatesDto;

    const where: Prisma.AffiliatesWhereInput = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(gender && { gender }),
      ...(dni && { dni: { contains: dni, mode: 'insensitive' } }),
      ...(sectorId && { sectorId }),
    };

    const affiliates = await this.database.affiliates.findMany({
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      where,
    });

    const totalAffiliates = await this.database.affiliates.count({ where });

    const safeAffiliates = affiliates.map(
      ({
        id,
        dni,
        name,
        phone,
        email,
        address,
        has_child,
        has_disable,
        gender,
      }) => ({
        id,
        dni,
        name,
        phone,
        email,
        address,
        has_child,
        has_disable,
        gender,
      }),
    );

    const paginatedResponse = PaginationHelper.build(
      safeAffiliates,
      totalAffiliates,
      Number(page),
      Number(limit),
    );

    return new ResponseHelper<PaginatedResponse<Partial<Affiliates>>>(
      'Afiliados obtenidos exitosamente',
      paginatedResponse,
    );
  }

  async findOne(id: string): Promise<ResponseHelper<AffiliateResponse>> {
    const affiliate = await this.database.affiliates.findUnique({
      where: { id },
      include: { sector: true, Children: true, user: true },
    });

    if (!affiliate) throw new BadRequestException('Afiliado no encontrado');

    const childrenFiltered = affiliate.Children.map(
      ({
        id,
        dni,
        first_name,
        last_name,
        age,
        birth_date,
        has_disable,
        gender,
        is_active,
      }) => ({
        id,
        dni,
        first_name,
        last_name,
        age,
        birth_date,
        has_disable,
        gender,
        is_active,
      }),
    );

    const {
      sector,
      user,
      created_at,
      updated_at,
      Children,
      userId,
      sectorId,
      ...rest
    } = affiliate;

    const data: AffiliateResponse = {
      ...rest,
      user: user
        ? {
            id: user.id,
            username: user.username,
            role: user.role,
            is_active: user.is_active,
          }
        : null,

      sector: sector
        ? (({ id, name, code }) => ({ id, name, code }))(sector)
        : null,
      Children: childrenFiltered,
    };

    return new ResponseHelper('Afiliado obtenido exitosamente', data);
  }
}
