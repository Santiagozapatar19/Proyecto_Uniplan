import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('profiles_leader')
export class ProfileLeader {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => UniplanUser, (user) => user.profileLeader)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'varchar', length: 80 })
  academicProgram!: string;

  @Column({ type: 'integer' })
  semester!: number;

  @Column({ type: 'varchar', length: 100 })
  associateGroup!: string;
}