import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileBienestar } from './entities/profile-bienestar.entity';
import { CreateProfileBienestarDto } from './dto/create-profile-bienestar.dto';
import { UpdateProfileBienestarDto } from './dto/update-profile-bienestar.dto';

@Injectable()
export class ProfileBienestarService {
  constructor(
    @InjectRepository(ProfileBienestar, 'uniplan')
    private readonly profileRepo: Repository<ProfileBienestar>,
  ) {}

  async create(dto: CreateProfileBienestarDto): Promise<ProfileBienestar> {
    const existing = await this.profileRepo.findOne({ where: { userId: dto.userId } });
    if (existing) {
      throw new ConflictException(`El perfil del usuario ${dto.userId} ya existe`);
    }

    return this.profileRepo.save(this.profileRepo.create(dto));
  }

  findAll(): Promise<ProfileBienestar[]> {
    return this.profileRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<ProfileBienestar> {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Perfil bienestar ${id} no encontrado`);
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileBienestarDto): Promise<ProfileBienestar> {
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
      throw new NotFoundException(`Perfil bienestar ${id} no encontrado`);
    }

    return { message: `Perfil bienestar ${id} eliminado correctamente` };
  }
}