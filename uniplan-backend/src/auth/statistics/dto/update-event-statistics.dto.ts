import { PartialType } from '@nestjs/mapped-types';
import { CreateEventStatisticsDto } from './create-event-statistics.dto';

export class UpdateEventStatisticsDto extends PartialType(CreateEventStatisticsDto) {}