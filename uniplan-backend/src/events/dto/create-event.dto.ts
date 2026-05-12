import {
  IsString, IsNotEmpty, IsOptional, IsIn, IsInt, IsDateString,
  Min, MaxLength, ValidateNested, IsArray, IsEmail, IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpeakerDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() profile?: string;
  @IsOptional() @IsString() affiliation?: string;
}

export class CreateEventDetailsDto {
  // Taller
  @IsOptional() @IsArray() @IsString({ each: true }) requiredMaterials?: string[];
  @IsOptional() @IsString() prerequisiteCourse?: string;
  @IsOptional() @IsInt() minimumSemester?: number;

  // Charla
  @IsOptional() @ValidateNested() @Type(() => CreateSpeakerDto) speaker?: CreateSpeakerDto;
  @IsOptional() @IsArray() @IsString({ each: true }) links?: string[];
  @IsOptional() @IsString() extendedDescription?: string;

  // Torneo
  @IsOptional() @IsString() sport?: string;
  @IsOptional() @IsString() rules?: string;
  @IsOptional() @IsString() bracketFormat?: string;
  @IsOptional() @IsInt() numTeams?: number;
  @IsOptional() @IsInt() playersPerTeam?: number;

  // Voluntariado
  @IsOptional() @IsString() cause?: string;
  @IsOptional() @IsInt() requiredHours?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) activities?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) meetingPoints?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) responsibleStaff?: string[];
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['workshop', 'talk', 'tournament', 'volunteering', 'other'])
  type!: string;

  @IsDateString()
  startDate!: string; // ISO 8601

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEventDetailsDto)
  details?: CreateEventDetailsDto;
}