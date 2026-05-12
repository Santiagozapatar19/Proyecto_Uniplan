import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventSchema } from 'src/events/schemas/event.schema';
import { UniplanUserMongo, UniplanUserMongoSchema } from 'src/uniplan-users/schemas/uniplan-user.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { Student } from 'src/institutional/entities/student.entity';
import { Enrollment as InstEnrollment } from 'src/institutional/entities/enrollment.entity';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';

@Module({
  imports: [
    // ── MongoDB — events y uniplan_users ──────────────────────
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: UniplanUserMongo.name, schema: UniplanUserMongoSchema },
    ]),

    // ── PostgreSQL UniPlan — estadísticas ──────────────────────
    TypeOrmModule.forFeature([EventStatistics], 'uniplan'),

    // ── PostgreSQL Institucional — solo lectura ─────────────────
    TypeOrmModule.forFeature([Student, InstEnrollment], 'institutional'),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}