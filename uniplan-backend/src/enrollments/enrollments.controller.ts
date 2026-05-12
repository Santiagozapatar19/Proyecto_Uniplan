import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Request } from 'express';

@Controller('enrollments')
@UseGuards(JwtAuthGuard) // todos los endpoints requieren login
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // POST /enrollments  — RF08: inscripción a evento
  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('enroll_event')
  @HttpCode(HttpStatus.CREATED)
  enroll(
    @Body() dto: CreateEnrollmentDto,
    @Req() req: Request & { user: UniplanUser },
  ) {
    return this.enrollmentsService.enroll(dto, req.user);
  }

  // DELETE /enrollments/:eventId  — RF09: cancelar inscripción
  @Delete(':eventId')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('cancel_enrollment')
  @HttpCode(HttpStatus.OK)
  cancel(
    @Param('eventId') eventId: string,
    @Req() req: Request & { user: UniplanUser },
  ) {
    return this.enrollmentsService.cancel(eventId, req.user);
  }

  // GET /enrollments/me  — historial del estudiante autenticado (RF14)
  @Get('me')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('view_events')
  getMyEnrollments(@Req() req: Request & { user: UniplanUser }) {
    return this.enrollmentsService.getMyEnrollments(req.user);
  }
}