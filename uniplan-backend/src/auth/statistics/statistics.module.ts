import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStatistics } from './entities/event-statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	imports: [TypeOrmModule.forFeature([EventStatistics], 'uniplan')],
	controllers: [StatisticsController],
	providers: [StatisticsService],
	exports: [StatisticsService],
})
export class StatisticsModule {}
