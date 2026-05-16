import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissions } from './entities/role-permission.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermissions, 'uniplan')
    private readonly rolePermissionRepo: Repository<RolePermissions>,
  ) {}

  async create(dto: CreateRolePermissionDto): Promise<RolePermissions> {
    const existing = await this.rolePermissionRepo.findOne({
      where: { roleId: dto.roleId, permissionId: dto.permissionId },
    });

    if (existing) {
      throw new ConflictException('La relación rol-permiso ya existe');
    }

    return this.rolePermissionRepo.save(this.rolePermissionRepo.create(dto));
  }

  findAll(): Promise<RolePermissions[]> {
    return this.rolePermissionRepo.find({
      relations: ['role', 'permission'],
      order: { roleId: 'ASC', permissionId: 'ASC' },
    });
  }

  async findOne(roleId: number, permissionId: number): Promise<RolePermissions> {
    const rolePermission = await this.rolePermissionRepo.findOne({
      where: { roleId, permissionId },
      relations: ['role', 'permission'],
    });

    if (!rolePermission) {
      throw new NotFoundException(`La relación ${roleId}/${permissionId} no fue encontrada`);
    }

    return rolePermission;
  }

  async remove(roleId: number, permissionId: number): Promise<{ message: string }> {
    const result = await this.rolePermissionRepo.delete({ roleId, permissionId });
    if (!result.affected) {
      throw new NotFoundException(`La relación ${roleId}/${permissionId} no fue encontrada`);
    }

    return { message: 'Relación rol-permiso eliminada correctamente' };
  }
}