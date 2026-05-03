import { Role } from 'src/auth/role/entities/role.entity';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  userId!: number;

  @PrimaryGeneratedColumn()
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
