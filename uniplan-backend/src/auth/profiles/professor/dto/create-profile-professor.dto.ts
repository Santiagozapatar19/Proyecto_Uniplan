import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileProfessorDto {
  @IsInt()
  userId!: number;

  @IsInt()
  facultyCode!: number;

  @IsInt()
  areaId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialization?: string;
}