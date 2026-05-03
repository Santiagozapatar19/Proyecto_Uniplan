import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryColumn({ type: 'integer' })
  code!: number;

  @Column({ type: 'varchar', length: 40 })
  name!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  location!: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
  phoneNumber!: string;

  @Column({ name: 'dean_id', type: 'varchar', length: 15, nullable: true })
  deanId!: string;
}