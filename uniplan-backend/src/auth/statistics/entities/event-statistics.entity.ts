import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_statistics')
export class EventStatistics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 24, unique: true })
  eventMongoId!: string;        // _id del evento en MongoDB como string

  @Column({ type: 'int' })
  maxCapacity!: number;

  @Column({ type: 'int', default: 0 })
  totalEnrolled!: number;

  @Column({ type: 'int', default: 0 })
  totalCancellations!: number;

  @Column({ type: 'int', default: 0 })
  totalAttendees!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  occupancyPercentage!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated!: Date;
}
