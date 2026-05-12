import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { UserRole } from 'src/auth/user-role/entities/user-role.entity';
import { Role } from 'src/auth/role/entities/role.entity';
import { ProfileProfessor } from 'src/auth/profiles/professor/entities/profile-professor.entity';
import { ProfileLeader } from 'src/auth/profiles/leader/entities/profile-leader.entity';
import { ProfileBienestar } from 'src/auth/profiles/bienestar/entities/profile-bienestar.entity';
import { Student } from 'src/institutional/entities/student.entity';
import { Employee } from 'src/institutional/entities/employee.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    // Entidades de la BD UniPlan (conexión 'uniplan')
    TypeOrmModule.forFeature(
      [UniplanUser, UserRole, Role, ProfileProfessor, ProfileLeader, ProfileBienestar],
      'uniplan',
    ),
    // Entidades de la BD institucional (solo lectura, conexión 'institutional')
    TypeOrmModule.forFeature([Student, Employee], 'institutional'),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}