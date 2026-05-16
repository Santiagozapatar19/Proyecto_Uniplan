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
import { ProfileBienestarService } from './profile-bienestar.service';
import { CreateProfileBienestarDto } from './dto/create-profile-bienestar.dto';
import { UpdateProfileBienestarDto } from './dto/update-profile-bienestar.dto';

@Controller('profiles/bienestar')
export class ProfileBienestarController {
  constructor(private readonly profileBienestarService: ProfileBienestarService) {}

  @Post()
  create(@Body() dto: CreateProfileBienestarDto) {
    return this.profileBienestarService.create(dto);
  }

  @Get()
  findAll() {
    return this.profileBienestarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileBienestarService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileBienestarDto) {
    return this.profileBienestarService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileBienestarService.remove(id);
  }
}