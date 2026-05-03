import { ProfileBienestar } from 'src/auth/profiles/bienestar/entities/profile-bienestar.entity';
import { ProfileLeader } from 'src/auth/profiles/leader/entities/profile-leader.entity';
import { ProfileProfessor } from 'src/auth/profiles/professor/entities/profile-professor.entity';
import { UserRole } from 'src/auth/user-role/entities/user-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';

@Entity('uniplan_users')
export class UniplanUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true , type: 'varchar', length: 20 })
  username!: string;

  @Column({ type: 'varchar', length: 100,})
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({type : 'boolean'})
  isActive!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'integer' })
  studentId!: number;

  @Column({ type: 'integer' })
  employeeId!: number;

  @OneToMany(() => UserRole, (userRole) => userRole.userId)
  userRoles!: UserRole[];

  @OneToMany(() => ProfileBienestar, (profile) => profile.userId)
  profileBienestar!: ProfileBienestar[];

  @OneToMany(() => ProfileLeader, (profile) => profile.userId)
  profileLeader!: ProfileLeader[];

  @OneToMany(() => ProfileProfessor, (profile) => profile.userId)
  profileProfessor!: ProfileProfessor[];
}
