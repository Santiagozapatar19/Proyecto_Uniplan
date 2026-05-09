import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UniplanUser } from 'src/auth/user/entities/uniplan-user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    // Si el endpoint no tiene @Roles(), dejamos pasar
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user: UniplanUser }>();
    const user = request.user;

    const userRoleNames = user.userRoles?.map((ur) => ur.role.name) ?? [];
    const hasRole = requiredRoles.some((role) => userRoleNames.includes(role));

    if (!hasRole) {
        throw new ForbiddenException('No tienes el rol requerido para esta acción');
    }

        return true;
    }
}