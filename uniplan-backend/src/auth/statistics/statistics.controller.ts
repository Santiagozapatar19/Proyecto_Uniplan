import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateEventStatisticsDto } from './dto/create-event-statistics.dto';
import { UpdateEventStatisticsDto } from './dto/update-event-statistics.dto';

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Post()
	create(@Body() dto: CreateEventStatisticsDto) {
		return this.statisticsService.create(dto);
	}

	@Get()
	findAll() {
		return this.statisticsService.findAll();
	}

	@Get(':eventMongoId')
	findOne(@Param('eventMongoId') eventMongoId: string) {
		return this.statisticsService.findOne(eventMongoId);
	}

	@Patch(':eventMongoId')
	update(
		@Param('eventMongoId') eventMongoId: string,
		@Body() dto: UpdateEventStatisticsDto,
	) {
		return this.statisticsService.update(eventMongoId, dto);
	}

	@Delete(':eventMongoId')
	remove(@Param('eventMongoId') eventMongoId: string) {
		return this.statisticsService.remove(eventMongoId);
	}
}
