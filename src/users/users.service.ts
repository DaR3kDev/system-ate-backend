import * as argon2 from 'argon2';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginationHelper } from '../common/pagination/pagination';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';
import { Prisma, Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseHelper<void>> {
    const { username, password, confirmPassword, role } = createUserDto;

    if (password !== confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    const user = await this.database.user.findUnique({
      where: {
        username,
      },
    });

    if (user) throw new BadRequestException('El usuario ya existe');

    await this.database.user.create({
      data: {
        username,
        password: await argon2.hash(password),
        role,
      },
    });

    return new ResponseHelper<void>('Usuario creado exitosamente');
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseHelper<void>> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    const { confirmPassword, isActive, ...rest } = updateUserDto;

    const updatedData = {
      ...rest,
      is_active: isActive !== undefined ? Boolean(isActive) : undefined,
    };

    await this.database.user.update({
      where: { id },
      data: updatedData,
    });

    return new ResponseHelper<void>('Usuario actualizado exitosamente');
  }

  async delete(id: string): Promise<ResponseHelper<void>> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    await this.database.user.delete({
      where: { id },
    });

    return new ResponseHelper<void>('Usuario eliminado exitosamente');
  }

  async toggleActive(id: string): Promise<ResponseHelper<void>> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    const updatedUser = await this.database.user.update({
      where: { id },
      data: {
        is_active: !user.is_active,
      },
    });

    return new ResponseHelper<void>(
      updatedUser.is_active
        ? 'Usuario activado exitosamente'
        : 'Usuario desactivado exitosamente',
    );
  }

  async paginationUser(
    paginationUserDto: PaginationUserDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<User>>>> {
    const { page, limit, search, role } = paginationUserDto;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { role: { equals: role as Role } },
        ],
      }),
      ...(role && { role }),
    };

    const users = await this.database.user.findMany({
      skip: (page - 1) * Number(limit),
      take: Number(limit),
      where,
    });

    const totalUsers = await this.database.user.count({ where });

    const safeUsers = users.map(({ id, username, role, is_active }) => ({
      id,
      username,
      role,
      is_active,
    }));

    const paginatedResponse = PaginationHelper.build(
      safeUsers,
      totalUsers,
      Number(page),
      Number(limit),
    );

    return new ResponseHelper<PaginatedResponse<Partial<User>>>(
      'Usuarios obtenidos exitosamente',
      paginatedResponse,
    );
  }

  async findOne(id: string) {
    return await this.database.user.findUnique({
      where: { id },
    });
  }
}
