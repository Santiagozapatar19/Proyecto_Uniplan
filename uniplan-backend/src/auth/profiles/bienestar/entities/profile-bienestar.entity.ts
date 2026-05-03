import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('profiles_bienestar')
export class ProfileBienestar {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => UniplanUser, (user) => user.profileBienestar)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'varchar', length: 100 })
  administrativeArea!: string;   

  @Column({ type: 'varchar', length: 80 })
  charge!: string;
}