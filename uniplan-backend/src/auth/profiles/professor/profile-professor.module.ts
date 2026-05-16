import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileProfessor } from './entities/profile-professor.entity';
import { ProfileProfessorController } from './profile-professor.controller';
import { ProfileProfessorService } from './profile-professor.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProfileProfessor], 'uniplan')],
	controllers: [ProfileProfessorController],
	providers: [ProfileProfessorService],
	exports: [ProfileProfessorService],
})
export class ProfileProfessorModule {}
