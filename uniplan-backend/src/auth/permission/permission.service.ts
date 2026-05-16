import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission, 'uniplan')
		private readonly permissionRepo: Repository<Permission>,
	) {}

	async create(dto: CreatePermissionDto): Promise<Permission> {
		const existing = await this.permissionRepo.findOne({ where: { name: dto.name } });
		if (existing) {
			throw new ConflictException(`El permiso ${dto.name} ya existe`);
		}

		return this.permissionRepo.save(this.permissionRepo.create(dto));
	}

	findAll(): Promise<Permission[]> {
		return this.permissionRepo.find({ order: { id: 'ASC' } });
	}

	async findOne(id: number): Promise<Permission> {
		const permission = await this.permissionRepo.findOne({
			where: { id },
			relations: ['rolePermissions', 'rolePermissions.role'],
		});

		if (!permission) {
			throw new NotFoundException(`Permiso ${id} no encontrado`);
		}

		return permission;
	}

	async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
		const permission = await this.findOne(id);

		if (dto.name && dto.name !== permission.name) {
			const existing = await this.permissionRepo.findOne({ where: { name: dto.name } });
			if (existing) {
				throw new ConflictException(`El permiso ${dto.name} ya existe`);
			}
		}

		Object.assign(permission, dto);
		return this.permissionRepo.save(permission);
	}

	async remove(id: number): Promise<{ message: string }> {
		const result = await this.permissionRepo.delete(id);
		if (!result.affected) {
			throw new NotFoundException(`Permiso ${id} no encontrado`);
		}

		return { message: `Permiso ${id} eliminado correctamente` };
	}
}
