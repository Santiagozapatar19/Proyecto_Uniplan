import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Subdocumento: entrada del historial 
@Schema({ _id: false })
class EventHistoryEntry {
  @Prop({ required: true, type: Types.ObjectId })
  eventId!: Types.ObjectId;   // ref → events._id

  @Prop({ required: true })
  eventCode!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  type!: string;

  @Prop({ required: true, type: Date })
  startDate!: Date;

  @Prop({ required: true, default: 'active' })
  enrollmentStatus!: string;  // 'active' | 'cancelled'
}
const EventHistoryEntrySchema = SchemaFactory.createForClass(EventHistoryEntry);

// Documento principal: usuario en MongoDB 
@Schema({ collection: 'uniplan_users', timestamps: true })
export class UniplanUserMongo extends Document {
  @Prop({ required: true, type: Number, unique: true })
  userId!: number;            // espejo de uniplan_users.id en PostgreSQL

  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  type!: string;              // 'student'|'professor'|'leader'|'welfare'|'admin'

  @Prop({ type: [EventHistoryEntrySchema], default: [] })
  eventHistory!: EventHistoryEntry[];
}

export const UniplanUserMongoSchema = SchemaFactory.createForClass(UniplanUserMongo);

UniplanUserMongoSchema.index({ userId: 1 });