import { IsOptional, IsIn, IsDateString, IsString } from 'class-validator';

export class FilterEventsDto {
  // RF06: filtrar por tipo de evento
  @IsOptional()
  @IsIn(['workshop', 'talk', 'tournament', 'volunteering', 'other'])
  type?: string;

  // RF06: filtrar por estado
  @IsOptional()
  @IsIn(['upcoming', 'ongoing', 'finished'])
  status?: string;

  // RF06: rango de fechas
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}