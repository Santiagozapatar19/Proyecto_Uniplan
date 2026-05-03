import { Permission } from 'src/auth/permission/entities/permission.entity';
import { Role } from 'src/auth/role/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('role_permissions')
export class RolePermissions {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn()
  roleId!: number;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn()
  permissionId!: number;
}
