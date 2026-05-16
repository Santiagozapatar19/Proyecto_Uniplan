import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileLeader } from './entities/profile-leader.entity';
import { CreateProfileLeaderDto } from './dto/create-profile-leader.dto';
import { UpdateProfileLeaderDto } from './dto/update-profile-leader.dto';

@Injectable()
export class ProfileLeaderService {
  constructor(
    @InjectRepository(ProfileLeader, 'uniplan')
    private readonly profileRepo: Repository<ProfileLeader>,
  ) {}

  async create(dto: CreateProfileLeaderDto): Promise<ProfileLeader> {
    const existing = await this.profileRepo.findOne({ where: { userId: dto.userId } });
    if (existing) {
      throw new ConflictException(`El perfil del usuario ${dto.userId} ya existe`);
    }

    return this.profileRepo.save(this.profileRepo.create(dto));
  }

  findAll(): Promise<ProfileLeader[]> {
    return this.profileRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<ProfileLeader> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Perfil líder ${id} no encontrado`);
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileLeaderDto): Promise<ProfileLeader> {
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
      throw new NotFoundException(`Perfil líder ${id} no encontrado`);
    }

    return { message: `Perfil líder ${id} eliminado correctamente` };
  }
}