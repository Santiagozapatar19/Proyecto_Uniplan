import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity('profile_professors')
export class ProfileProfessor {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.profileProfessor)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column()
  userId!: number;

  @Column()
  facultyCode!: number;

  @Column()
  areaId!: number;

  @Column({ nullable: true })
  specialization?: string;
}
