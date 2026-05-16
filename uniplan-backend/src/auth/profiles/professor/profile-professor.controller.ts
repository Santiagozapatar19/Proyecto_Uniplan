import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ProfileProfessorService } from './profile-professor.service';
import { CreateProfileProfessorDto } from './dto/create-profile-professor.dto';
import { UpdateProfileProfessorDto } from './dto/update-profile-professor.dto';

@Controller('profiles/professor')
export class ProfileProfessorController {
	constructor(private readonly profileProfessorService: ProfileProfessorService) {}

	@Post()
	create(@Body() dto: CreateProfileProfessorDto) {
		return this.profileProfessorService.create(dto);
	}

	@Get()
	findAll() {
		return this.profileProfessorService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.profileProfessorService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileProfessorDto) {
		return this.profileProfessorService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.profileProfessorService.remove(id);
	}
}
