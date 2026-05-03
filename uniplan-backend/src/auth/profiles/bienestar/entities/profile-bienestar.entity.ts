import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('profile_bienestars')
export class ProfileBienestar {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.profileBienestar)
  @JoinColumn()
  userId!: number;

  @Column()
  adminstrativeArea!: string;

  @Column()
  charge!: string;

  
}
