import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventSchema } from './schemas/event.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    // ── MongoDB — colección events ─────────────────────────────
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),

    // ── PostgreSQL UniPlan — estadísticas (conexión 'uniplan') ─
    TypeOrmModule.forFeature([EventStatistics], 'uniplan'),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // exportado para que EnrollmentsModule pueda llamar syncStats
})
export class EventsModule {}