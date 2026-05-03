import { RolePermissions } from 'src/auth/role-permission/entities/role-permission.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 20, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @OneToMany(() => RolePermissions, (rolePermission) => rolePermission.permission)
  rolePermissions!: RolePermissions[];
}
