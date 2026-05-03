import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity('profiles_professor')
export class ProfileProfessor {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.profileProfessor)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'integer' })
  facultyCode!: number;

  @Column({ type: 'integer' })
  areaId!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialization?: string;
}
