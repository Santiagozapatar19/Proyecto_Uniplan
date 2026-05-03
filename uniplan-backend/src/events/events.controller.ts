import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  @Post()
  create(@Body() dto: CreateEventDto) {
    return { message: 'create event stub' };
  }

  @Get()
  findAll() {
    return [];
  }
}
