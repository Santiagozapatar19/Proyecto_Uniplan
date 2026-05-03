import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return { message: 'create user stub' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }
}
