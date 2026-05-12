import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model, FilterQuery } from "mongoose";
import { Repository } from 'typeorm';
import { Event } from './schemas/event.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';

@Injectable()
export class EventsService {
  constructor(
    // ── MongoDB ────────────────────────────────────────────────
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,

    // ── PostgreSQL UniPlan (estadísticas) ──────────────────────
    @InjectRepository(EventStatistics, 'uniplan')
    private readonly statsRepo: Repository<EventStatistics>,
  ) {}

  // ── RF10: Crear evento ────────────────────────────────────────
  async create(dto: CreateEventDto, organizer: UniplanUser): Promise<Event> {
    // Validar que la fecha no sea pasada
    const start = new Date(dto.startDate);
    if (start < new Date()) {
      throw new BadRequestException('La fecha de inicio no puede ser en el pasado');
    }

    const end = new Date(dto.endDate);
    if (end <= start) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
    }

    // Generar código único: EVT-YYYY-NNN
    const code = await this.generateCode();

    // Extraer nombre y rol del organizador
    const organizerRole = organizer.userRoles?.[0]?.role?.name ?? 'organizer';

    const newEvent = new this.eventModel({
      code,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      status: 'upcoming',
      startDate: start,
      endDate: end,
      location: dto.location,
      maxCapacity: dto.maxCapacity,
      availableSpots: dto.maxCapacity,
      organizer: {
        userId: organizer.id,
        fullName: organizer.username, // se mejora cuando tengamos nombre completo
        email: organizer.email,
        role: organizerRole,
      },
      details: dto.details ?? {},
      enrollments: [],
    });

    const saved = await newEvent.save();

    // Crear registro de estadísticas en PostgreSQL
    await this.statsRepo.save(
      this.statsRepo.create({
        eventMongoId: (saved._id as any).toString(),
        maxCapacity: dto.maxCapacity,
        totalEnrolled: 0,
        totalCancellations: 0,
        totalAttendees: 0,
        occupancyPercentage: 0,
      }),
    );

    return saved;
  }

  // ── RF05: Catálogo de eventos con filtros opcionales ──────────
  async findAll(filters: FilterEventsDto): Promise<Event[]> {
    const query: FilterQuery<Event> = {};

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    if (filters.from || filters.to) {
      query.startDate = {};
      if (filters.from) query.startDate.$gte = new Date(filters.from);
      if (filters.to) query.startDate.$lte = new Date(filters.to);
    }

    return this.eventModel
      .find(query)
      .select('-enrollments') // el catálogo no muestra la lista de inscritos
      .sort({ startDate: 1 })
      .exec();
  }

  // ── RF07: Detalle completo de un evento ───────────────────────
  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException(`Evento ${id} no encontrado`);
    return event;
  }

  // ── RF11: Lista de inscritos (solo el organizador del evento) ─
  async getEnrollments(eventId: string, requesterId: number) {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException(`Evento ${eventId} no encontrado`);

    if (event.organizer.userId !== requesterId) {
      throw new ForbiddenException('Solo el organizador puede ver los inscritos');
    }

    return event.enrollments;
  }

  // ── RF12: Exportar inscritos en CSV ───────────────────────────
  async exportEnrollmentsCsv(eventId: string, requesterId: number): Promise<string> {
    const enrollments = await this.getEnrollments(eventId, requesterId);

    const header = 'studentId,fullName,studentCode,email,enrollmentDate,status';
    const rows = enrollments.map((e) =>
      [e.studentId, e.fullName, e.studentCode, e.email, e.enrollmentDate.toISOString(), e.status].join(','),
    );

    return [header, ...rows].join('\n');
  }

  // ── Estadísticas de un evento (RF13) ─────────────────────────
  async getStatistics(eventMongoId: string): Promise<EventStatistics | null> {
    return this.statsRepo.findOne({ where: { eventMongoId } });
  }

  // ── Helpers ───────────────────────────────────────────────────
  private async generateCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.eventModel.countDocuments();
    const seq = String(count + 1).padStart(3, '0');
    return `EVT-${year}-${seq}`;
  }

  // Método interno llamado desde EnrollmentsService para actualizar stats en PG
  async syncStats(eventMongoId: string): Promise<void> {
    const event = await this.eventModel.findById(eventMongoId).exec();
    if (!event) return;

    const totalEnrolled = event.enrollments.filter((e) => e.status === 'active').length;
    const totalCancellations = event.enrollments.filter((e) => e.status === 'cancelled').length;
    const occupancyPercentage = event.maxCapacity > 0
      ? parseFloat(((totalEnrolled / event.maxCapacity) * 100).toFixed(2))
      : 0;

    await this.statsRepo.update(
      { eventMongoId },
      {
        totalEnrolled,
        totalCancellations,
        occupancyPercentage,
        lastUpdated: new Date(),
      },
    );
  }
}