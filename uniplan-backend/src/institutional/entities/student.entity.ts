import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentNumber: string;

  @Column()
  name: string;
}
