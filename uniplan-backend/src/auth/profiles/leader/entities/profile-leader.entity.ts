import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity('profile_leaders')
export class ProfileLeader {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.profileLeader)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column()
  userId!: number;

  @Column()
  academicProgram!: string;

  @Column()
  semester!: number;

  @Column()
  associateGroup!: string;

}
