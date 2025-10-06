// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Importa si usas ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
     private configService: ConfigService
  ) {
    // Obtén el secreto de la misma forma que en AuthModule
    const secret = configService.get<string>('JWT_SECRET') || 'default_secret';

    console.log(`[JwtStrategy] Constructor: Usando secretOrKey para VERIFICAR: ${secret}`);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Esta es la clave para VERIFICAR tokens
      secretOrKey: secret, 
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Validate: Payload recibido:', payload);
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}