// src/auth/jwt-auth.guard.ts

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
    console.log('[JwtAuthGuard] Constructor inicializado.'); // LOG 3
  }

  canActivate(context: ExecutionContext) {
    console.log('[JwtAuthGuard] canActivate: Verificando acceso...'); // LOG 4
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(`[JwtAuthGuard] canActivate: ¿Es ruta pública? ${isPublic}`); // LOG 5

    if (isPublic) {
      return true; // Permite acceso a rutas públicas
    }

    // Si no es pública, llama a la lógica de AuthGuard ('jwt')
    console.log('[JwtAuthGuard] canActivate: No es pública, llamando a super.canActivate...'); // LOG 6
    // El `super.canActivate(context)` llamará a JwtStrategy.validate internamente
    // y luego a handleRequest. Retorna un Observable<boolean> o Promise<boolean> o boolean.
    return super.canActivate(context);
  }

  // handleRequest se llama DESPUÉS de que JwtStrategy.validate (si tuvo éxito)
  handleRequest(err, user, info) {
    console.log('[JwtAuthGuard] handleRequest: Procesando resultado de la estrategia...'); // LOG 7
    console.log(`[JwtAuthGuard] handleRequest: Error:`, err); // LOG 8
    console.log(`[JwtAuthGuard] handleRequest: User (resultado de validate):`, user); // LOG 9
    console.log(`[JwtAuthGuard] handleRequest: Info/Detalles:`, info); // LOG 10

    if (err || !user) {
      console.error('[JwtAuthGuard] handleRequest: Autenticación fallida. Lanzando UnauthorizedException.'); // LOG 11
      // Aquí es donde probablemente se lanza el 401 si la validación del token falla.
      // 'info' puede contener detalles como 'JsonWebTokenError: invalid signature' o 'TokenExpiredError: jwt expired'
      throw err || new UnauthorizedException(`Autenticación fallida: ${info?.message || 'Token inválido o ausente'}`);
    }
    // Si todo va bien, retorna el usuario que se adjuntará a request.user
    console.log('[JwtAuthGuard] handleRequest: Autenticación exitosa. Usuario adjuntado.'); // LOG 12
    return user;
  }

  getRequest(context: ExecutionContext) {
    // Soporte para REST y GraphQL
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
    // Para GraphQL
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GqlExecutionContext } = require('@nestjs/graphql');
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    } catch (e) {
      throw new UnauthorizedException('No se pudo extraer el request del contexto');
    }
  }
}