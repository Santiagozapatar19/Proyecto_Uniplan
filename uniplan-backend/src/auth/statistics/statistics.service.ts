import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventStatistics } from './entities/event-statistics.entity';
import { CreateEventStatisticsDto } from './dto/create-event-statistics.dto';
import { UpdateEventStatisticsDto } from './dto/update-event-statistics.dto';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(EventStatistics, 'uniplan')
		private readonly statsRepo: Repository<EventStatistics>,
	) {}

	async create(dto: CreateEventStatisticsDto): Promise<EventStatistics> {
		const existing = await this.statsRepo.findOne({ where: { eventMongoId: dto.eventMongoId } });
		if (existing) {
			throw new ConflictException(`Ya existen estadísticas para el evento ${dto.eventMongoId}`);
		}

		return this.statsRepo.save(this.statsRepo.create(dto));
	}

	findAll(): Promise<EventStatistics[]> {
		return this.statsRepo.find({ order: { lastUpdated: 'DESC' } });
	}

	async findOne(eventMongoId: string): Promise<EventStatistics> {
		const stats = await this.statsRepo.findOne({ where: { eventMongoId } });
		if (!stats) {
			throw new NotFoundException(`Estadísticas para el evento ${eventMongoId} no encontradas`);
		}

		return stats;
	}

	async update(eventMongoId: string, dto: UpdateEventStatisticsDto): Promise<EventStatistics> {
		const stats = await this.findOne(eventMongoId);
		Object.assign(stats, dto);
		stats.eventMongoId = eventMongoId;
		return this.statsRepo.save(stats);
	}

	async remove(eventMongoId: string): Promise<{ message: string }> {
		const result = await this.statsRepo.delete({ eventMongoId });
		if (!result.affected) {
			throw new NotFoundException(`Estadísticas para el evento ${eventMongoId} no encontradas`);
		}

		return { message: `Estadísticas del evento ${eventMongoId} eliminadas correctamente` };
	}
}
