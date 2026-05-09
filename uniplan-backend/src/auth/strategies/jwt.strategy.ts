import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { JwtPayloadDto } from 'src/auth/login/dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        @InjectRepository(UniplanUser, 'uniplan')
        private readonly userRepo: Repository<UniplanUser>,
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: config.get<string>('JWT_SECRET')!,
    });
    }

    async validate(payload: JwtPayloadDto) {
        const user = await this.userRepo.findOne({
        where: { id: payload.sub, isActive: true },
        relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
        ],
    });

    if (!user) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return user;
    }
}