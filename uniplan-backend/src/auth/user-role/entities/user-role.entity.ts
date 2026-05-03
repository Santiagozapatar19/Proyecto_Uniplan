import { Role } from 'src/auth/role/entities/role.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn({ type: 'integer' })
  userId!: number;

  @PrimaryColumn({ type: 'integer' })
  roleId!: number;

  @ManyToOne(() => UniplanUser, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user!: UniplanUser;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt!: Date;

  @Column({ type: 'integer', nullable: true })
  assignedBy!: number | null;
}