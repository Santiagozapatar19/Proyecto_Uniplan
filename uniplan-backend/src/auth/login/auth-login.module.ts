import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // Registramos la entidad en la conexión 'uniplan' (PostgreSQL UniPlan)
    TypeOrmModule.forFeature([UniplanUser], 'uniplan'),

    // JWT configurado de forma asíncrona desde .env
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '1d') as StringValue },
        }),
    }),
    ],
        controllers: [AuthController],
        providers: [AuthService],
        exports: [AuthService, JwtModule], // JwtModule exportado para que otros módulos puedan verificar tokens
})
export class AuthLoginModule {}