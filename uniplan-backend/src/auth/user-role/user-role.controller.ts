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
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user-roles')
export class UserRoleController {
	constructor(private readonly userRoleService: UserRoleService) {}

	@Post()
	create(@Body() dto: CreateUserRoleDto) {
		return this.userRoleService.create(dto);
	}

	@Get()
	findAll() {
		return this.userRoleService.findAll();
	}

	@Get(':userId/:roleId')
	findOne(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('roleId', ParseIntPipe) roleId: number,
	) {
		return this.userRoleService.findOne(userId, roleId);
	}

	@Patch(':userId/:roleId')
	update(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('roleId', ParseIntPipe) roleId: number,
		@Body() dto: UpdateUserRoleDto,
	) {
		return this.userRoleService.update(userId, roleId, dto);
	}

	@Delete(':userId/:roleId')
	remove(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('roleId', ParseIntPipe) roleId: number,
	) {
		return this.userRoleService.remove(userId, roleId);
	}
}
