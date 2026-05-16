import { IsInt, IsOptional } from 'class-validator';

export class CreateUserRoleDto {
  @IsInt()
  userId!: number;

  @IsInt()
  roleId!: number;

  @IsOptional()
  @IsInt()
  assignedBy?: number;
}