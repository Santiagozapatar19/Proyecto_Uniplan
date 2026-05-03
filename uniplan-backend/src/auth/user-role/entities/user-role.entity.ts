import { Role } from 'src/auth/role/entities/role.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UniplanUser, (user) => user.userRoles)
  @JoinColumn()
  userId!: number;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn()
  roleId!: number;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt!: Date;

  @Column()
  assignedBy!: number;
}
