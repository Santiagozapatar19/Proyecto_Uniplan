import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { UniplanUser } from '../user/entities/uniplan-user.entity';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UniplanUser, 'uniplan')
    private readonly userRepository: Repository<UniplanUser>,
    private readonly jwtService: JwtService,
  ) {}

  async login (userLoginDto: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: [{ username: userLoginDto.username }, { email: userLoginDto.username }],
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
      ],
  });

    if (!user || !user.isActive) {
      return { error: 'Credenciales inválidas' };
    }

    const passwordMatch = await bcrypt.compare(userLoginDto.password, user.password);

    if (!passwordMatch) {
      return { error: 'Credenciales inválidas' };
    }

    const roles = user.userRoles.map(ur => ur.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name),
        ),
      ),
    ];

    const payload: JwtPayloadDto & { roles: string[]; permissions: string[] } = {
      sub: user.id,
      username: user.username,
      roles,
      permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
        permissions,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userRoles',
        'userRoles.role',
        'profileProfessor',
        'profileLeader',
        'profileBienestar',
      ],
    });
    
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
 
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
