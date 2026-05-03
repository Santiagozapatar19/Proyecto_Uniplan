import { Permission } from 'src/auth/permission/entities/permission.entity';
import { Role } from 'src/auth/role/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('role_permissions')
export class RolePermissions {
  @PrimaryGeneratedColumn()
  roleId!: number;

  @PrimaryGeneratedColumn()
  permissionId!: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({name: 'roleId'})
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({name: 'permissionId'})
  permission!: Permission;
}
