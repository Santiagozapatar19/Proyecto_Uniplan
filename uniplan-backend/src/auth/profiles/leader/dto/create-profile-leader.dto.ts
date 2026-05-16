import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateProfileLeaderDto {
  @IsInt()
  userId!: number;

  @IsString()
  @MaxLength(80)
  academicProgram!: string;

  @IsInt()
  semester!: number;

  @IsString()
  @MaxLength(100)
  associateGroup!: string;
}