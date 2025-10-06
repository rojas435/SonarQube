import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access to public routes', () => {
      const context = { getHandler: jest.fn(), getClass: jest.fn() } as any;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.anything(), [
        context.getHandler(),
        context.getClass(),
      ]);
    });

  });

  describe('handleRequest', () => {
    it('should return the user if authentication is successful', () => {
      const user = { id: 'uuid', email: 'test@example.com' };
      const result = guard.handleRequest(null, user, null);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if no user is provided', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException);
    });

    it('should include error details in UnauthorizedException', () => {
      const info = { message: 'Token expired' };
      expect(() => guard.handleRequest(null, null, info)).toThrow(
        new UnauthorizedException('Autenticación fallida: Token expired'),
      );
    });
  });
});