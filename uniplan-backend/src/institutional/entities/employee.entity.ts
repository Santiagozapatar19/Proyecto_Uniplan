import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
