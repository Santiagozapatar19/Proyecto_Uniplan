import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEventStatisticsDto {
  @IsString()
  eventMongoId!: string;

  @IsInt()
  maxCapacity!: number;

  @IsOptional()
  @IsInt()
  totalEnrolled?: number;

  @IsOptional()
  @IsInt()
  totalCancellations?: number;

  @IsOptional()
  @IsInt()
  totalAttendees?: number;
}