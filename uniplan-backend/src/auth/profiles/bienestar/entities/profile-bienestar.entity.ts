import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('profiles_bienestar')
export class ProfileBienestar {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.profileBienestar)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'varchar', length: 255 })
  adminstrativeArea!: string;

  @Column({ type: 'varchar', length: 255 })
  charge!: string;

  
}
