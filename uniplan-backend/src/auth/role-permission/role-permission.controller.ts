import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Controller('role-permissions')
export class RolePermissionController {
	constructor(private readonly rolePermissionService: RolePermissionService) {}

	@Post()
	create(@Body() dto: CreateRolePermissionDto) {
		return this.rolePermissionService.create(dto);
	}

	@Get()
	findAll() {
		return this.rolePermissionService.findAll();
	}

	@Get(':roleId/:permissionId')
	findOne(
		@Param('roleId', ParseIntPipe) roleId: number,
		@Param('permissionId', ParseIntPipe) permissionId: number,
	) {
		return this.rolePermissionService.findOne(roleId, permissionId);
	}

	@Delete(':roleId/:permissionId')
	remove(
		@Param('roleId', ParseIntPipe) roleId: number,
		@Param('permissionId', ParseIntPipe) permissionId: number,
	) {
		return this.rolePermissionService.remove(roleId, permissionId);
	}
}
