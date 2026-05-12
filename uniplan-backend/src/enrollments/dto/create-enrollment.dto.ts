import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsMongoId()
  @IsNotEmpty()
  eventId!: string; // _id del evento en MongoDB
}