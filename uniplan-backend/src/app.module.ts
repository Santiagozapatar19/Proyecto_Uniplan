import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { InstitutionalModule } from './institutional/institutional.module';
import { UserModule } from './auth/user/user.module';
import { EventsModule } from './events/events.module';
import { UniplanUsersModule } from './uniplan-users/uniplan-users.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Conexión 1: PostgreSQL UniPlan ─────────────────────────
    TypeOrmModule.forRootAsync({
      name: 'uniplan',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PG_HOST'),
        port: config.get<number>('PG_PORT'),
        username: config.get('PG_USERNAME'),
        password: config.get('PG_PASSWORD'),
        database: config.get('PG_DATABASE'),
        entities: [__dirname + '/auth/**/*.entity.js'],
        synchronize: false,
      }),
    }),

    // ── Conexión 2: PostgreSQL Institucional (solo lectura) ────
    TypeOrmModule.forRootAsync({
      name: 'institutional',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PG_INST_HOST'),
        port: config.get<number>('PG_INST_PORT'),
        username: config.get('PG_INST_USERNAME'),
        password: config.get('PG_INST_PASSWORD'),
        database: config.get('PG_INST_DATABASE'),
        entities: [__dirname + '/institutional/**/*.entity.js'],
        synchronize: false, // NUNCA true en la institucional
      }),
    }),

    // ── Conexión 3: MongoDB ────────────────────────────────────
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
      }),
    }),

    AuthModule,
    InstitutionalModule,
    UserModule,        // RF01 registro estudiantes, RF03 registro organizadores
    EventsModule,      // RF05-RF13 gestión de eventos
    UniplanUsersModule,
    EnrollmentsModule,
    ReportsModule,
  ],
})
export class AppModule {}