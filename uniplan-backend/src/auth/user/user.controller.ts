import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterStudentDto, RegisterOrganizerDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users/register  — RF01: auto-registro de estudiantes (público)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerStudent(@Body() dto: RegisterStudentDto) {
    return this.userService.registerStudent(dto);
  }

  // POST /users/organizers  — RF03: solo admin puede crear organizadores
  @Post('organizers')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('manage_users')
  @HttpCode(HttpStatus.CREATED)
  registerOrganizer(
    @Body() dto: RegisterOrganizerDto,
    @Req() req: Request & { user: UniplanUser },
  ) {
    return this.userService.registerOrganizer(dto, req.user.id);
  }

  // GET /users  — solo admin lista todos los usuarios
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('manage_users')
  findAll() {
    return this.userService.findAll();
  }

  // GET /users/:id  — admin o el propio usuario
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}