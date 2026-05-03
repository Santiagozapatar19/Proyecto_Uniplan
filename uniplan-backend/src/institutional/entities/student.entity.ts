import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'first_name', type: 'varchar', length: 30 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30 })
  lastName!: string;

  @Column({ type: 'varchar', length: 50 })
  email!: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate!: Date;

  @Column({ name: 'campus_code', type: 'integer', nullable: true })
  campusCode!: number;
}
