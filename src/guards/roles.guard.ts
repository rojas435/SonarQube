// src/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, ContextType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    console.log('[RolesGuard] Constructor inicializado.'); // LOG 13
  }

  canActivate(context: ExecutionContext): boolean {
    console.log('[RolesGuard] canActivate: Verificando roles...'); // LOG 14

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(`[RolesGuard] canActivate: Roles requeridos: ${requiredRoles}`); // LOG 15

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('[RolesGuard] canActivate: No se requieren roles específicos. Acceso permitido.'); // LOG 16
      return true; // Si no hay metadata @Roles, permitir
    }

    // Detectar si es GraphQL o REST
    let user;
    if (context.getType() === ('http' as any)) {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    } else if (context.getType() === ('graphql' as any)) {
      const ctx = GqlExecutionContext.create(context);
      user = ctx.getContext().req.user;
    }
    console.log('[RolesGuard] canActivate: Usuario en request:', user); // LOG 17

    if (!user || !user.role) {
      console.error('[RolesGuard] canActivate: Usuario o rol no encontrado en la request. Lanzando ForbiddenException.'); // LOG 18
      // Esto no debería pasar si JwtAuthGuard funcionó, pero es una salvaguarda.
      throw new ForbiddenException('No tienes permiso para acceder a este recurso (rol no encontrado en el token).');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log(`[RolesGuard] canActivate: ¿Usuario tiene el rol requerido (${user.role} vs ${requiredRoles})? ${hasRole}`); // LOG 19

    if (!hasRole) {
      console.warn(`[RolesGuard] canActivate: Rol de usuario '${user.role}' no coincide con roles requeridos '${requiredRoles.join(', ')}'. Lanzando ForbiddenException.`); // LOG 20
      throw new ForbiddenException('No tienes permiso para acceder a este recurso (rol insuficiente).');
    }

    console.log('[RolesGuard] canActivate: Usuario tiene el rol requerido. Acceso concedido.'); // LOG 21
    return true;
  }
}