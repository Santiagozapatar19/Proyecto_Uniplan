import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('enrollments_institutional')
export class EnrollmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  courseCode: string;
}
