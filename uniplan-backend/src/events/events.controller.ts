import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Req, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';

@Controller('events')
@UseGuards(JwtAuthGuard) // todos los endpoints de eventos requieren login
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // POST /events  — RF10: crear evento (organizadores)
  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('create_event')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateEventDto,
    @Req() req: Request & { user: UniplanUser },
  ) {
    return this.eventsService.create(dto, req.user);
  }

  // GET /events  — RF05 + RF06: catálogo con filtros opcionales
  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('view_events')
  findAll(@Query() filters: FilterEventsDto) {
    return this.eventsService.findAll(filters);
  }

  // GET /events/:id  — RF07: detalle completo
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('view_events')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // GET /events/:id/enrollments  — RF11: lista de inscritos (organizador)
  @Get(':id/enrollments')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('view_enrollments')
  getEnrollments(
    @Param('id') id: string,
    @Req() req: Request & { user: UniplanUser },
  ) {
    return this.eventsService.getEnrollments(id, req.user.id);
  }

  // GET /events/:id/enrollments/export  — RF12: exportar CSV
  @Get(':id/enrollments/export')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('export_csv')
  async exportCsv(
    @Param('id') id: string,
    @Req() req: Request & { user: UniplanUser },
    @Res() res: Response,
  ) {
    const csv = await this.eventsService.exportEnrollmentsCsv(id, req.user.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="inscritos-${id}.csv"`);
    res.send(csv);
  }

  // GET /events/:id/statistics  — RF13: estadísticas del evento
  @Get(':id/statistics')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('view_statistics')
  getStatistics(@Param('id') id: string) {
    return this.eventsService.getStatistics(id);
  }
}