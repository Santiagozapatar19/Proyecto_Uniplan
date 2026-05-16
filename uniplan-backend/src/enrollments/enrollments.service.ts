import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Event } from 'src/events/schemas/event.schema';
import { UniplanUserMongo } from 'src/uniplan-users/schemas/uniplan-user.schema';
import { EventStatistics } from 'src/auth/statistics/entities/event-statistics.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Student } from 'src/institutional/entities/student.entity';
import { Enrollment as InstEnrollment } from 'src/institutional/entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    // ── MongoDB ──────────────────────────────────────────────────
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,

    @InjectModel(UniplanUserMongo.name)
    private readonly userMongoModel: Model<UniplanUserMongo>,

    // ── PostgreSQL UniPlan ───────────────────────────────────────
    @InjectRepository(EventStatistics, 'uniplan')
    private readonly statsRepo: Repository<EventStatistics>,

    // ── PostgreSQL Institucional (solo lectura) ───────────────────
    @InjectRepository(Student, 'institutional')
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(InstEnrollment, 'institutional')
    private readonly instEnrollmentRepo: Repository<InstEnrollment>,
  ) {}

  // ── RF08: Inscripción a evento ────────────────────────────────
  async enroll(dto: CreateEnrollmentDto, user: UniplanUser): Promise<object> {
    // 1. Obtener el evento
    const event = await this.eventModel.findById(dto.eventId).exec();
    if (!event) throw new NotFoundException(`Evento ${dto.eventId} no encontrado`);

    // 2. Verificar que el evento esté disponible
    if (event.status === 'finished') {
      throw new BadRequestException('El evento ya finalizó');
    }

    // 3. Verificar cupos disponibles
    if (event.availableSpots <= 0) {
      throw new BadRequestException('No hay cupos disponibles para este evento');
    }

    // 4. Verificar que el estudiante no esté ya inscrito
    const alreadyEnrolled = event.enrollments.some(
      (e) => e.studentId === user.studentId && e.status === 'active',
    );
    if (alreadyEnrolled) {
      throw new ConflictException('Ya estás inscrito en este evento');
    }

    // 5. Validaciones específicas por tipo de evento (RF08)
    await this.validateByEventType(event, user);

    // 6. Buscar datos del estudiante en la BD institucional
    const instStudent = await this.studentRepo.findOne({
      where: { id: user.studentId! },
    });
    if (!instStudent) {
      throw new NotFoundException('Estudiante no encontrado en la base institucional');
    }

    // 7. Agregar inscripción al evento en MongoDB (operación atómica)
    const enrollmentDate = new Date();
    await this.eventModel.findByIdAndUpdate(
      dto.eventId,
      {
        $push: {
          enrollments: {
            studentId: user.studentId,
            fullName: `${instStudent.firstName} ${instStudent.lastName}`,
            studentCode: String(instStudent.id),
            email: user.email,
            enrollmentDate,
            status: 'active',
          },
        },
        $inc: { availableSpots: -1 },
      },
      { new: true },
    ).exec();

    // 8. Actualizar historial del usuario en MongoDB
    await this.userMongoModel.findOneAndUpdate(
      { userId: user.id },
      {
        $push: {
          eventHistory: {
            eventId: event._id,
            eventCode: event.code,
            title: event.title,
            type: event.type,
            startDate: event.startDate,
            enrollmentStatus: 'active',
          },
        },
      },
    ).exec();

    // 9. Sincronizar estadísticas en PostgreSQL
    await this.syncStats(dto.eventId);

    return {
      message: 'Inscripción exitosa',
      eventId: dto.eventId,
      eventTitle: event.title,
      enrollmentDate,
    };
  }

  // ── RF09: Cancelación de inscripción ──────────────────────────
  async cancel(eventId: string, user: UniplanUser): Promise<object> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException(`Evento ${eventId} no encontrado`);

    // Verificar que el estudiante tiene una inscripción activa
    const enrollment = event.enrollments.find(
      (e) => e.studentId === user.studentId && e.status === 'active',
    );
    if (!enrollment) {
      throw new BadRequestException('No tienes una inscripción activa en este evento');
    }

    // Cambiar estado a 'cancelled' y liberar cupo (operación atómica)
    await this.eventModel.findOneAndUpdate(
      { _id: eventId, 'enrollments.studentId': user.studentId },
      {
        $set: { 'enrollments.$.status': 'cancelled' },
        $inc: { availableSpots: 1 },
      },
    ).exec();

    // Actualizar historial en MongoDB
    await this.userMongoModel.findOneAndUpdate(
      { userId: user.id, 'eventHistory.eventId': event._id },
      { $set: { 'eventHistory.$.enrollmentStatus': 'cancelled' } },
    ).exec();

    // Sincronizar estadísticas en PostgreSQL
    await this.syncStats(eventId);

    return {
      message: 'Inscripción cancelada exitosamente',
      eventId,
      eventTitle: event.title,
    };
  }

  // ── Historial de inscripciones del estudiante autenticado ─────
  async getMyEnrollments(user: UniplanUser): Promise<object[]> {
    const userMongo = await this.userMongoModel
      .findOne({ userId: user.id })
      .select('eventHistory')
      .exec();

    return userMongo?.eventHistory ?? [];
  }

  // ── Validaciones específicas por tipo de evento (RF08) ────────
  private async validateByEventType(event: Event, user: UniplanUser): Promise<void> {
    switch (event.type) {
      case 'workshop':
        await this.validateWorkshop(event, user);
        break;
      case 'tournament':
        await this.validateTournament(event, user);
        break;
      case 'volunteering':
        await this.validateVolunteering(event, user);
        break;
      case 'talk':
      case 'other':
        // RF08: Charla y Otros — sin validaciones adicionales
        break;
    }
  }

  // RF08 — Taller: verificar prerequisite_course en BD institucional
  private async validateWorkshop(event: Event, user: UniplanUser): Promise<void> {
    const prerequisiteCourse = event.details?.prerequisiteCourse;
    if (!prerequisiteCourse) return; // sin prerequisito, pasa directo

    const hasCourse = await this.instEnrollmentRepo.findOne({
      where: {
        studentId: String(user.studentId),
        nrc: prerequisiteCourse,
        status: 'active',
      },
    });

    if (!hasCourse) {
      throw new BadRequestException(
        `Para inscribirse en este taller debes haber cursado: ${prerequisiteCourse}`,
      );
    }

    // Verificar semestre mínimo si aplica (si la BD institucional contiene ese campo)
    const minimumSemester = event.details?.minimumSemester;
    if (minimumSemester) {
      const student = await this.studentRepo.findOne({ where: { id: user.studentId! } });
      const semester = (student as any)?.semester;
      if (semester !== undefined && semester < minimumSemester) {
        throw new BadRequestException(
          `Este taller requiere estar en semestre ${minimumSemester} o superior`,
        );
      }
    }
  }

  // RF08 — Torneo: verificar que no haya traslape de horario con otro torneo
  private async validateTournament(event: Event, user: UniplanUser): Promise<void> {
    // Buscar otros torneos donde el estudiante esté inscrito activo
    const overlapping = await this.eventModel.findOne({
      type: 'tournament',
      'enrollments.studentId': user.studentId,
      'enrollments.status': 'active',
      _id: { $ne: event._id },
      // Traslape: el otro torneo comienza antes de que termine este y termina después de que empiece
      startDate: { $lt: event.endDate },
      endDate: { $gt: event.startDate },
    }).exec();

    if (overlapping) {
      throw new BadRequestException(
        `Ya estás inscrito en el torneo "${overlapping.title}" que se traslapa con este horario`,
      );
    }
  }

  // RF08 — Voluntariado: validar horas mínimas requeridas
  private async validateVolunteering(event: Event, user: UniplanUser): Promise<void> {
    const requiredHours = event.details?.requiredHours;
    if (!requiredHours) return; // sin requisito de horas, pasa directo

    // Contamos matrículas activas como proxy de horas acumuladas
    // En un sistema real aquí iría una tabla de horas de voluntariado
    const activeEnrollments = await this.instEnrollmentRepo.count({
      where: { studentId: String(user.studentId), status: 'active' },
    });

    // Regla: cada materia activa = 10 horas de elegibilidad
    const estimatedHours = activeEnrollments * 10;
    if (estimatedHours < requiredHours) {
      throw new BadRequestException(
        `Este voluntariado requiere al menos ${requiredHours} horas. ` +
        `Tu perfil acumula aproximadamente ${estimatedHours} horas.`,
      );
    }
  }

  // ── Sincronizar stats en PostgreSQL ───────────────────────────
  private async syncStats(eventMongoId: string): Promise<void> {
    const event = await this.eventModel.findById(eventMongoId).exec();
    if (!event) return;

    const totalEnrolled = event.enrollments.filter((e) => e.status === 'active').length;
    const totalCancellations = event.enrollments.filter((e) => e.status === 'cancelled').length;
    const occupancyPercentage =
      event.maxCapacity > 0
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