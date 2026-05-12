import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventSchema } from 'src/events/schemas/event.schema';
import { UniplanUserMongo, UniplanUserMongoSchema } from 'src/uniplan-users/schemas/uniplan-user.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
    imports: [
    MongooseModule.forFeature([
        { name: Event.name, schema: EventSchema },
        { name: UniplanUserMongo.name, schema: UniplanUserMongoSchema },
    ]),
    TypeOrmModule.forFeature([EventStatistics], 'uniplan'),
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}