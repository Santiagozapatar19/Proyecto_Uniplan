import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryColumn({ name: 'student_id', type: 'varchar', length: 15 })
  studentId!: string;

  @PrimaryColumn({ name: 'nrc', type: 'varchar', length: 10 })
  nrc!: string;

  @Column({ name: 'enrollment_date', type: 'date', nullable: true })
  enrollmentDate!: Date;

  @Column({ type: 'varchar', length: 15, nullable: true })
  status!: string;
}
