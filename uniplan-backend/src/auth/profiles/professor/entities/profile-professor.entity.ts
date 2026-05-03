import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('profiles_professor')
export class ProfileProfessor {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => UniplanUser, (user) => user.profileProfessor)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'integer' })
  facultyCode!: number;

  @Column({ type: 'integer' })
  areaId!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialization!: string | null;
}