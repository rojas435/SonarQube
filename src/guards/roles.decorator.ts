import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Usaremos esta clave en el RolesGuard
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);