import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateProfileBienestarDto {
  @IsInt()
  userId!: number;

  @IsString()
  @MaxLength(100)
  administrativeArea!: string;

  @IsString()
  @MaxLength(80)
  charge!: string;
}