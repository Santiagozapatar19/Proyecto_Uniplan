import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Event } from 'src/events/schemas/event.schema';
import { UniplanUserMongo } from 'src/uniplan-users/schemas/uniplan-user.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,

    @InjectModel(UniplanUserMongo.name)
    private readonly userMongoModel: Model<UniplanUserMongo>,

    @InjectRepository(EventStatistics, 'uniplan')
    private readonly statsRepo: Repository<EventStatistics>,
  ) {}

  // ── RF14 Informe 1: Historial de participación del estudiante ─
  async getStudentHistory(userId: number) {
    const userMongo = await this.userMongoModel
      .findOne({ userId })
      .select('fullName email eventHistory')
      .exec();

    if (!userMongo) {
      throw new NotFoundException(`No se encontró historial para el usuario ${userId}`);
    }

    const total = userMongo.eventHistory.length;
    const active = userMongo.eventHistory.filter((e) => e.enrollmentStatus === 'active').length;
    const cancelled = userMongo.eventHistory.filter((e) => e.enrollmentStatus === 'cancelled').length;

    return {
      student: {
        userId,
        fullName: userMongo.fullName,
        email: userMongo.email,
      },
      summary: { total, active, cancelled },
      history: userMongo.eventHistory,
    };
  }

  // ── RF14 Informe 2: Eventos con mayor ocupación por tipo ──────
  async getTopEventsByOccupancy(limit = 10) {
    // Traemos estadísticas ordenadas por porcentaje de ocupación desde PostgreSQL
    const stats = await this.statsRepo.find({
      order: { occupancyPercentage: 'DESC' },
      take: limit,
    });

    if (stats.length === 0) return [];

    // Enriquecemos con datos del evento desde MongoDB
    const enriched = await Promise.all(
      stats.map(async (stat) => {
        const event = await this.eventModel
          .findById(stat.eventMongoId)
          .select('title type status startDate location')
          .exec();

        return {
          eventId: stat.eventMongoId,
          title: event?.title ?? 'Evento no encontrado',
          type: event?.type ?? '-',
          status: event?.status ?? '-',
          startDate: event?.startDate ?? null,
          location: event?.location ?? '-',
          maxCapacity: stat.maxCapacity,
          totalEnrolled: stat.totalEnrolled,
          totalCancellations: stat.totalCancellations,
          occupancyPercentage: Number(stat.occupancyPercentage),
          lastUpdated: stat.lastUpdated,
        };
      }),
    );

    // Agrupar por tipo
    const byType = enriched.reduce<Record<string, typeof enriched>>((acc, ev) => {
      const key = ev.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ev);
      return acc;
    }, {});

    return {
      topEvents: enriched,
      byType,
    };
  }

  // ── Informe extra: resumen global de todos los eventos ────────
  async getGlobalSummary() {
    const [totalEvents, stats] = await Promise.all([
      this.eventModel.countDocuments().exec(),
      this.statsRepo
        .createQueryBuilder('s')
        .select('SUM(s.totalEnrolled)', 'totalEnrolled')
        .addSelect('SUM(s.totalCancellations)', 'totalCancellations')
        .addSelect('AVG(s.occupancyPercentage)', 'avgOccupancy')
        .getRawOne<{ totalEnrolled: string; totalCancellations: string; avgOccupancy: string }>(),
    ]);

    return {
      totalEvents,
      totalEnrolled: Number(stats?.totalEnrolled ?? 0),
      totalCancellations: Number(stats?.totalCancellations ?? 0),
      avgOccupancy: parseFloat(Number(stats?.avgOccupancy ?? 0).toFixed(2)),
    };
  }
}