import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si el endpoint no tiene @RequirePermissions(), dejamos pasar
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user: UniplanUser }>();
    const user = request.user;

    // Aplanamos todos los permisos del usuario desde sus roles
    const userPermissions = new Set(
      user.userRoles?.flatMap((ur) =>
        ur.role.rolePermissions?.map((rp) => rp.permission.name) ?? [],
      ) ?? [],
    );

    const hasAll = requiredPermissions.every((p) => userPermissions.has(p));

    if (!hasAll) {
      throw new ForbiddenException('No tienes los permisos necesarios para esta acción');
    }

    return true;
  }
}