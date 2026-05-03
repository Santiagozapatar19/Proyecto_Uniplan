import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Subdocumento: organizador
@Schema({ _id: false })
class Organizer {
  @Prop({ required: true, type: Number })
  userId!: number;            

  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  role!: string;
}
const OrganizerSchema = SchemaFactory.createForClass(Organizer);

// Subdocumento: speaker (para charlas) 
@Schema({ _id: false })
class Speaker {
  @Prop() fullName?: string;
  @Prop() profile?: string;
  @Prop() affiliation?: string;
}
const SpeakerSchema = SchemaFactory.createForClass(Speaker);

// Subdocumento: details (variable por tipo de evento) 
@Schema({ _id: false })
class EventDetails {
  // Taller
  @Prop({ type: [String] })
  requiredMaterials?: string[];

  @Prop()
  prerequisiteCourse?: string;

  @Prop()
  minimumSemester?: number;

  // Charla
  @Prop({ type: SpeakerSchema })
  speaker?: Speaker;

  @Prop({ type: [String] })
  links?: string[];

  @Prop()
  extendedDescription?: string;

  // Torneo
  @Prop()
  sport?: string;

  @Prop()
  rules?: string;

  @Prop()
  bracketFormat?: string;

  @Prop()
  numTeams?: number;

  @Prop()
  playersPerTeam?: number;

  // Voluntariado
  @Prop()
  cause?: string;

  @Prop()
  requiredHours?: number;

  @Prop({ type: [String] })
  activities?: string[];

  @Prop({ type: [String] })
  meetingPoints?: string[];

  @Prop({ type: [String] })
  responsibleStaff?: string[];

  // Otros — campo libre
  @Prop({ type: Object })
  extraData?: Record<string, any>;
}
const EventDetailsSchema = SchemaFactory.createForClass(EventDetails);

// Subdocumento: inscripción embebida
@Schema({ _id: false })
class Enrollment {
  @Prop({ required: true, type: Number })
  studentId!: number;         // FK lógica → uniplan_users.id (PostgreSQL)

  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true })
  studentCode!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true, type: Date })
  enrollmentDate!: Date;

  @Prop({ required: true, default: 'active' })
  status!: string;            // 'active' | 'cancelled'
}
const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

@Schema({ collection: 'events', timestamps: true })
export class Event extends Document {
  @Prop({ required: true, unique: true })
  code!: string;              // ej: EVT-2025-001

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type!: string;              // 'workshop'|'talk'|'tournament'|'volunteering'|'other'

  @Prop({ required: true, default: 'upcoming' })
  status!: string;            // 'upcoming'|'ongoing'|'finished'

  @Prop({ required: true, type: Date })
  startDate!: Date;

  @Prop({ required: true, type: Date })
  endDate!: Date;

  @Prop({ required: true })
  location!: string;

  @Prop({ required: true, min: 1 })
  maxCapacity!: number;

  @Prop({ required: true })
  availableSpots!: number;

  @Prop({ required: true, type: OrganizerSchema })
  organizer!: Organizer;

  @Prop({ type: EventDetailsSchema })
  details?: EventDetails;

  @Prop({ type: [EnrollmentSchema], default: [] })
  enrollments!: Enrollment[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Índices útiles para las queries más frecuentes
EventSchema.index({ type: 1, status: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ 'enrollments.studentId': 1 });