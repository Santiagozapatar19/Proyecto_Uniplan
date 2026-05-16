import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role, 'uniplan')
		private readonly roleRepo: Repository<Role>,
	) {}

	async create(dto: CreateRoleDto): Promise<Role> {
		const existing = await this.roleRepo.findOne({ where: { name: dto.name } });
		if (existing) {
			throw new ConflictException(`El rol ${dto.name} ya existe`);
		}

		return this.roleRepo.save(this.roleRepo.create(dto));
	}

	findAll(): Promise<Role[]> {
		return this.roleRepo.find({ order: { id: 'ASC' } });
	}

	async findOne(id: number): Promise<Role> {
		const role = await this.roleRepo.findOne({
			where: { id },
			relations: ['userRoles', 'rolePermissions', 'rolePermissions.permission'],
		});

		if (!role) {
			throw new NotFoundException(`Rol ${id} no encontrado`);
		}

		return role;
	}

	async update(id: number, dto: UpdateRoleDto): Promise<Role> {
		const role = await this.findOne(id);

		if (dto.name && dto.name !== role.name) {
			const existing = await this.roleRepo.findOne({ where: { name: dto.name } });
			if (existing) {
				throw new ConflictException(`El rol ${dto.name} ya existe`);
			}
		}

		Object.assign(role, dto);
		return this.roleRepo.save(role);
	}

	async remove(id: number): Promise<{ message: string }> {
		const result = await this.roleRepo.delete(id);
		if (!result.affected) {
			throw new NotFoundException(`Rol ${id} no encontrado`);
		}

		return { message: `Rol ${id} eliminado correctamente` };
	}
}
