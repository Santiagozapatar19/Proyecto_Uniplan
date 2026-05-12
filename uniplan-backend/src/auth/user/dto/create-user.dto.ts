import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  IsIn,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

// ── Perfil Profesor ──────────────────────────────────────────
export class CreateProfileProfessorDto {
  @IsInt()
  facultyCode!: number;

  @IsInt()
  areaId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialization?: string;
}

// ── Perfil Líder Estudiantil ─────────────────────────────────
export class CreateProfileLeaderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  academicProgram!: string;

  @IsInt()
  semester!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  associateGroup!: string;
}

// ── Perfil Bienestar ─────────────────────────────────────────
export class CreateProfileBienestarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  administrativeArea!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  charge!: string;
}

// ── Registro de Estudiante (RF01) ────────────────────────────
export class RegisterStudentDto {
  @IsInt()
  studentId!: number; // ID en la BD institucional para validar que existe

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;
}

// ── Registro de Organizador (RF03) ───────────────────────────
// El admin puede crear profesores, líderes o personal de bienestar
export class RegisterOrganizerDto {
  @IsInt()
  employeeId!: number; // ID en la BD institucional para validar que existe

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;

  @IsIn(['professor', 'leader', 'welfare'])
  organizerType!: 'professor' | 'leader' | 'welfare';

  // Solo uno de estos tres debe venir según organizerType
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileProfessorDto)
  profileProfessor?: CreateProfileProfessorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileLeaderDto)
  profileLeader?: CreateProfileLeaderDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileBienestarDto)
  profileBienestar?: CreateProfileBienestarDto;
}