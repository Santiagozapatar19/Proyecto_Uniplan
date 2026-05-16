import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRoleService {
	constructor(
		@InjectRepository(UserRole, 'uniplan')
		private readonly userRoleRepo: Repository<UserRole>,
	) {}

	async create(dto: CreateUserRoleDto): Promise<UserRole> {
		const existing = await this.userRoleRepo.findOne({
			where: { userId: dto.userId, roleId: dto.roleId },
		});

		if (existing) {
			throw new ConflictException('La relación usuario-rol ya existe');
		}

		return this.userRoleRepo.save(this.userRoleRepo.create(dto));
	}

	findAll(): Promise<UserRole[]> {
		return this.userRoleRepo.find({
			relations: ['role'],
			order: { assignedAt: 'DESC' },
		});
	}

	async findOne(userId: number, roleId: number): Promise<UserRole> {
		const userRole = await this.userRoleRepo.findOne({
			where: { userId, roleId },
			relations: ['role'],
		});

		if (!userRole) {
			throw new NotFoundException(`La relación ${userId}/${roleId} no fue encontrada`);
		}

		return userRole;
	}

	async update(userId: number, roleId: number, dto: UpdateUserRoleDto): Promise<UserRole> {
		const userRole = await this.findOne(userId, roleId);
		Object.assign(userRole, dto);
		userRole.userId = userId;
		userRole.roleId = roleId;
		return this.userRoleRepo.save(userRole);
	}

	async remove(userId: number, roleId: number): Promise<{ message: string }> {
		const result = await this.userRoleRepo.delete({ userId, roleId });
		if (!result.affected) {
			throw new NotFoundException(`La relación ${userId}/${roleId} no fue encontrada`);
		}

		return { message: 'Relación usuario-rol eliminada correctamente' };
	}
}
