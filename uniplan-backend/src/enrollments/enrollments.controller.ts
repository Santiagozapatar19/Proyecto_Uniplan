import { Controller, Post, Body } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  @Post()
  create(@Body() dto: CreateEnrollmentDto) {
    return { message: 'create enrollment stub' };
  }
}
