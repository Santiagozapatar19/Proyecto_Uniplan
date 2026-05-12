import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Request } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /reports/my-history  — RF14: historial propio del estudiante
  @Get('my-history')
  @RequirePermissions('view_reports')
  getMyHistory(@Req() req: Request & { user: UniplanUser }) {
    return this.reportsService.getStudentHistory(req.user.id);
  }

  // GET /reports/students/:userId/history  — admin ve el historial de cualquier usuario
  @Get('students/:userId/history')
  @RequirePermissions('manage_users')
  getStudentHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.reportsService.getStudentHistory(userId);
  }

  // GET /reports/top-events?limit=10  — RF14: eventos con mayor ocupación por tipo
  @Get('top-events')
  @RequirePermissions('view_reports')
  getTopEvents(@Query('limit') limit?: string) {
    return this.reportsService.getTopEventsByOccupancy(limit ? parseInt(limit) : 10);
  }

  // GET /reports/summary  — resumen global (admin y bienestar)
  @Get('summary')
  @RequirePermissions('view_statistics')
  getGlobalSummary() {
    return this.reportsService.getGlobalSummary();
  }
}