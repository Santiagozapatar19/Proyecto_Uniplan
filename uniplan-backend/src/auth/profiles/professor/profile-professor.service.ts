import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileProfessor } from './entities/profile-professor.entity';
import { CreateProfileProfessorDto } from './dto/create-profile-professor.dto';
import { UpdateProfileProfessorDto } from './dto/update-profile-professor.dto';

@Injectable()
export class ProfileProfessorService {
	constructor(
		@InjectRepository(ProfileProfessor, 'uniplan')
		private readonly profileRepo: Repository<ProfileProfessor>,
	) {}

	async create(dto: CreateProfileProfessorDto): Promise<ProfileProfessor> {
		const existing = await this.profileRepo.findOne({ where: { userId: dto.userId } });
		if (existing) {
			throw new ConflictException(`El perfil del usuario ${dto.userId} ya existe`);
		}

		return this.profileRepo.save(this.profileRepo.create(dto));
	}

	findAll(): Promise<ProfileProfessor[]> {
		return this.profileRepo.find({ order: { id: 'ASC' } });
	}

	async findOne(id: number): Promise<ProfileProfessor> {
		const profile = await this.profileRepo.findOne({ where: { id } });
		if (!profile) {
			throw new NotFoundException(`Perfil profesor ${id} no encontrado`);
		}

		return profile;
	}

	async update(id: number, dto: UpdateProfileProfessorDto): Promise<ProfileProfessor> {
		const profile = await this.findOne(id);

		if (dto.userId && dto.userId !== profile.userId) {
			const existing = await this.profileRepo.findOne({ where: { userId: dto.userId } });
			if (existing) {
				throw new ConflictException(`El perfil del usuario ${dto.userId} ya existe`);
			}
		}

		Object.assign(profile, dto);
		return this.profileRepo.save(profile);
	}

	async remove(id: number): Promise<{ message: string }> {
		const result = await this.profileRepo.delete(id);
		if (!result.affected) {
			throw new NotFoundException(`Perfil profesor ${id} no encontrado`);
		}

		return { message: `Perfil profesor ${id} eliminado correctamente` };
	}
}
