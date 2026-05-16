import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProfileLeaderService } from './profile-leader.service';
import { CreateProfileLeaderDto } from './dto/create-profile-leader.dto';
import { UpdateProfileLeaderDto } from './dto/update-profile-leader.dto';

@Controller('profiles/leader')
export class ProfileLeaderController {
  constructor(private readonly profileLeaderService: ProfileLeaderService) {}

  @Post()
  create(@Body() dto: CreateProfileLeaderDto) {
    return this.profileLeaderService.create(dto);
  }

  @Get()
  findAll() {
    return this.profileLeaderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileLeaderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileLeaderDto) {
    return this.profileLeaderService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileLeaderService.remove(id);
  }
}