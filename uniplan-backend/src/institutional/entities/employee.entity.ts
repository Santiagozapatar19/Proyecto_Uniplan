import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'first_name', type: 'varchar', length: 30 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30 })
  lastName!: string;

  @Column({ type: 'varchar', length: 50 })
  email!: string;

  @Column({ name: 'employee_type', type: 'varchar', length: 30, nullable: true })
  employeeType!: string;

  @Column({ name: 'campus_code', type: 'integer', nullable: true })
  campusCode!: number;
}
