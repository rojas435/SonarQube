// test/user/user.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common'; // Importa NotFoundException si prefieres simular eso
import * as request from 'supertest';
import { UserService } from '../../src/accounts/user/user.service'; // Ruta a tu servicio
import { UserController } from '../../src/accounts/user/user.controller'; // Ruta a tu controlador
import { RolesGuard } from '../../src/guards/roles.guard'; // Ruta a tu RolesGuard
// NO importamos JwtAuthGuard aquí

// --- DATOS SIMULADOS ---
const mockUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // UUID que SÍ existe
const mockUser = {
  id: mockUserId,
  name: 'Test User',
  email: 'test@example.com',
  // Añade otras propiedades que tu entidad User tenga
};
const mockUsers = [mockUser];
const nonExistentValidUUID = '11111111-2222-3333-4444-555555555555'; // UUID que NO existe
const invalidUUID = 'esto-no-es-un-uuid'; // ID inválido

// --- MOCKS ---

// Mock del Servicio de Usuario (¡REVISADO CON CUIDADO!)
const mockUserService = {
  getAll: jest.fn().mockResolvedValue(mockUsers),

  findById: jest.fn().mockImplementation(async (id: string) => {
    // Añade estos logs si sigue fallando para ver qué pasa EXACTAMENTE:
    console.log(`\n--- MOCK findById ---`);
    console.log(`>>> ID Recibido por el mock: ${id}`);
    console.log(`>>> Comparando con mockUserId: ${mockUserId}`);
    console.log(`>>> Tipo de ID recibido: ${typeof id}, Tipo de mockUserId: ${typeof mockUserId}`); // Verifica tipos
    const sonIguales = id === mockUserId;
    console.log(`>>> Resultado de la comparación (id === mockUserId): ${sonIguales}`);
    console.log(`---------------------`);

    if (id === mockUserId) {
      console.log(">>> Mock devolviendo: mockUser");
      return Promise.resolve(mockUser); // Devuelve el usuario si el ID coincide
    } else {
      console.log(">>> Mock ELSE branch: LANZANDO NotFoundException");
      throw new NotFoundException(`Mock: User with id ${id} not found`); // Lanzar excepción
    }
  }),
  // ...otros mocks si los necesitas
};

// Mock del RolesGuard (SÍ necesario, está en el controlador)
const mockRolesGuard = {
  canActivate: jest.fn(() => true),
};

// NO definimos mockJwtAuthGuard aquí

describe('UserController (E2E) - Public Routes', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController], // Solo el controlador
      providers: [
        {
          provide: UserService,
          useValue: mockUserService, // Usamos el mock del servicio
        },
      ],
    })
    // SOLO anulamos RolesGuard (el que está en el controlador)
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard)
    // NO anulamos JwtAuthGuard aquí
    .compile();

    app = moduleFixture.createNestApplication();

    // Aplicar ValidationPipe (necesario)
    app.useGlobalPipes(new ValidationPipe({
       whitelist: true,
       forbidNonWhitelisted: true,
       transform: true,
    }));

    await app.init();
    httpServer = app.getHttpServer();
  });

  afterEach(() => {
     jest.clearAllMocks(); // Limpia mocks entre pruebas
  });

  afterAll(async () => {
    if (app) {
      await app.close(); // Cierra la app
    }
  });

  // --- Pruebas GET /user ---
  describe('GET /user', () => {
    it('should return an array of users and status 200', async () => {
      const response = await request(httpServer)
        .get('/user')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
      expect(mockUserService.findById).not.toHaveBeenCalled();
      // SÓLO esperamos que RolesGuard sea llamado
      expect(mockRolesGuard.canActivate).toHaveBeenCalledTimes(1);
      // NO esperamos que JwtAuthGuard sea llamado en esta suite
    });

    it('should pass query parameters correctly', async () => {
      const queryParams = { limit: '10', offset: '0'}; // Sin 'search'

      await request(httpServer)
        .get('/user')
        .query(queryParams)
        .expect(200);

      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
      expect(mockRolesGuard.canActivate).toHaveBeenCalledTimes(1);
      // NO esperamos que JwtAuthGuard sea llamado
    });
  });

  // --- Pruebas GET /user/:id ---
  describe('GET /user/:id', () => {
    it('should return a single user and status 200 for a valid and existing ID', async () => {
      const response = await request(httpServer)
        .get(`/user/${mockUserId}`) // ID que SÍ existe
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.findById).toHaveBeenCalledTimes(1);
      expect(mockRolesGuard.canActivate).toHaveBeenCalledTimes(1);
      // NO esperamos que JwtAuthGuard sea llamado
    });

    // *** LA PRUEBA PROBLEMÁTICA ***
    it('should return 404 Not Found for a valid UUID that does not exist', async () => {
      // Añade logs si SIGUE fallando para verificar los IDs en el momento de la prueba
      console.log(`\n--- TEST 404 ---`);
      console.log(`>>> Probando ID: ${nonExistentValidUUID}`);
      console.log(`>>> ID que existe: ${mockUserId}`);
      console.log(`----------------`);

      await request(httpServer)
        .get(`/user/${nonExistentValidUUID}`) // ID que NO existe
        .expect(404);                         // <<<--- ¡LA EXPECTATIVA CLAVE!

      // Verificamos las llamadas a los mocks relevantes
      expect(mockUserService.findById).toHaveBeenCalledWith(nonExistentValidUUID);
      expect(mockUserService.findById).toHaveBeenCalledTimes(1);
      expect(mockRolesGuard.canActivate).toHaveBeenCalledTimes(1);
      // NO esperamos que JwtAuthGuard sea llamado
    });

    it('should return 400 Bad Request for an invalid UUID', async () => {
      await request(httpServer)
        .get(`/user/${invalidUUID}`) // ID inválido
        .expect(400);               // Espera 400 por ParseUUIDPipe

      expect(mockUserService.findById).not.toHaveBeenCalled(); // El servicio no se llama
      expect(mockRolesGuard.canActivate).toHaveBeenCalledTimes(1); // RolesGuard sí se llama
      // NO esperamos que JwtAuthGuard sea llamado
    });
  });
}); 