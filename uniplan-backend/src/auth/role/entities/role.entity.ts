import { RolePermissions } from 'src/auth/role-permission/entities/role-permission.entity';
import { UserRole } from 'src/auth/user-role/entities/user-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.roleId)
  userRoles!: UserRole[];

  @OneToMany(() => RolePermissions, (rolePermission) => rolePermission.roleId)
  rolePermissions!: RolePermissions[];
}
