import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileProfessorDto } from './create-profile-professor.dto';

export class UpdateProfileProfessorDto extends PartialType(CreateProfileProfessorDto) {}