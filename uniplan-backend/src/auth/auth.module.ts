import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniplanUser } from './user/entities/uniplan-user.entity';
import { UserRole } from './user-role/entities/user-role.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { RolePermissions } from './role-permission/entities/role-permission.entity';
import { ProfileProfessor } from './profiles/professor/entities/profile-professor.entity';
import { ProfileLeader } from './profiles/leader/entities/profile-leader.entity';
import { ProfileBienestar } from './profiles/bienestar/entities/profile-bienestar.entity';
import { EventStatistics } from './statistics/entities/event-statistics.entity';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserRoleModule } from './user-role/user-role.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { ProfileProfessorModule } from './profiles/professor/profile-professor.module';
import { ProfileLeaderModule } from './profiles/leader/profile-leader.module';
import { ProfileBienestarModule } from './profiles/bienestar/profile-bienestar.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthLoginModule } from './login/auth-login.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Todas las entidades de PostgreSQL UniPlan en un solo forFeature
    TypeOrmModule.forFeature(
      [
        UniplanUser,
        UserRole,
        Role,
        Permission,
        RolePermissions,
        ProfileProfessor,
        ProfileLeader,
        ProfileBienestar,
        EventStatistics,
      ],
      'uniplan',
    ),

    AuthLoginModule,
    RoleModule,
    PermissionModule,
    UserRoleModule,
    RolePermissionModule,
    ProfileProfessorModule,
    ProfileLeaderModule,
    ProfileBienestarModule,
    StatisticsModule,
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, TypeOrmModule, AuthLoginModule],
})
export class AuthModule {}