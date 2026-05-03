import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
