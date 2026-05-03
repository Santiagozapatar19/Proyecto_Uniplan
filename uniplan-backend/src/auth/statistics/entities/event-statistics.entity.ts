import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_statistics')
export class EventStatisticsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: string;

  @Column('json', { nullable: true })
  data?: any;
}
