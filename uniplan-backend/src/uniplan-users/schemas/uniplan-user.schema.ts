import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UniplanUser extends Document {
  @Prop({ required: true })
  username!: string;

  @Prop()
  email?: string;
}

export const UniplanUserSchema = SchemaFactory.createForClass(UniplanUser);
