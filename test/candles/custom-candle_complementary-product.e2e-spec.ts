import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { CustomCandleComplementaryProductController } from '../../src/candles/custom-candle_complementary-product/custom-candle_complementary-product.controller';
import { CustomCandleComplementaryProductService } from '../../src/candles/custom-candle_complementary-product/custom-candle_complementary-product.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('CustomCandleComplementaryProductController (E2E)', () => {
  let app: INestApplication;

  const mockEntityId = 1;
  const nonExistentId = 999; // ID válido pero no existente
  const mockEntity = {
    id: mockEntityId,
    customCandle: { id: 'uuid-candle' },
    complementaryProduct: { id: 1 },
  };
  const mockEntities = [mockEntity];

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockEntities),
    findOne: jest.fn().mockImplementation(async (id: number) => {
      if (id === mockEntityId) return Promise.resolve(mockEntity);
      throw new NotFoundException(`CustomCandleComplementaryProduct with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 2, ...dto })),
    update: jest.fn().mockImplementation(async (id: number, dto) => {
      if (id === mockEntityId) return { id, ...dto };
      throw new NotFoundException(`CustomCandleComplementaryProduct with id ${id} not found`);
    }),
    remove: jest.fn().mockImplementation(async (id: number) => {
      if (id === mockEntityId) return Promise.resolve(mockEntity);
      throw new NotFoundException(`CustomCandleComplementaryProduct with id ${id} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CustomCandleComplementaryProductController],
      providers: [{ provide: CustomCandleComplementaryProductService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /custom-candle-complementary-product', () => {
    it('should return all CustomCandleComplementaryProducts', async () => {
      const response = await request(app.getHttpServer()).get('/custom-candle-complementary-product').expect(200);
      expect(response.body).toEqual(mockEntities);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /custom-candle-complementary-product/:id', () => {
    it('should return a CustomCandleComplementaryProduct by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/custom-candle-complementary-product/${mockEntityId}`).expect(200);
      expect(response.body).toEqual(mockEntity);
      expect(mockService.findOne).toHaveBeenCalledWith(mockEntityId);
    });

    it('should return 404 if CustomCandleComplementaryProduct is not found', async () => {
      await request(app.getHttpServer())
        .get(`/custom-candle-complementary-product/${nonExistentId}`)
        .expect(404);
    });
  });

  // describe('POST /custom-candle-complementary-product', () => {
  //   it('should create a new CustomCandleComplementaryProduct', async () => {
  //     const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };
  //     const response = await request(app.getHttpServer()).post('/custom-candle-complementary-product').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 2, ...createDto });
  //     expect(mockService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { customCandleId: '', complementaryProductId: null }; // Datos inválidos
  //     await request(app.getHttpServer()).post('/custom-candle-complementary-product').send(createDto).expect(400);
  //   });
  // });

  describe('DELETE /custom-candle-complementary-product/:id', () => {
    it('should delete a CustomCandleComplementaryProduct', async () => {
      const response = await request(app.getHttpServer()).delete(`/custom-candle-complementary-product/${mockEntityId}`).expect(200);
      expect(response.body).toEqual(mockEntity);
      expect(mockService.remove).toHaveBeenCalledWith(mockEntityId);
    });

    it('should return 404 if CustomCandleComplementaryProduct is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/custom-candle-complementary-product/${nonExistentId}`)
        .expect(404);
    });
  });
});