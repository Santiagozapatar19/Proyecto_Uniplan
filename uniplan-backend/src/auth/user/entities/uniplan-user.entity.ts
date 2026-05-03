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

  @Column({ type: 'integer', nullable: true })
  studentId!: number | null;

  @Column({ type: 'integer', nullable: true })
  employeeId!: number | null;

  @OneToMany(() => UserRole, (userRole) => userRole.userId)
  userRoles!: UserRole[];

  @OneToOne(() => ProfileBienestar, (profile) => profile.user, { nullable: true })
  profileBienestar!: ProfileBienestar | null;

  @OneToOne(() => ProfileLeader, (profile) => profile.user, { nullable: true })
  profileLeader!: ProfileLeader | null;

  @OneToOne(() => ProfileProfessor, (profile) => profile.user, { nullable: true })
  profileProfessor!: ProfileProfessor | null;
}
