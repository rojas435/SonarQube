import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { ComplementaryProductController } from '../../src/candles/complementary-product/complementary-product.controller';
import { ComplementaryProductService } from '../../src/candles/complementary-product/complementary-product.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('ComplementaryProductController (E2E)', () => {
  let app: INestApplication;

  const mockProductId = 1;
  const nonExistentId = 999; 
  const mockProduct = { id: mockProductId, name: 'Product 1', price: 10.5, quantity: 5 };
  const mockProducts = [mockProduct];

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn().mockImplementation(async (id: number) => {
      if (id === mockProductId) return Promise.resolve(mockProduct);
      throw new NotFoundException(`ComplementaryProduct with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 2, ...dto })),
    update: jest.fn().mockImplementation(async (id: number, dto) => {
      if (id === mockProductId) return { id, ...dto };
      throw new NotFoundException(`ComplementaryProduct with id ${id} not found`);
    }),
    remove: jest.fn().mockImplementation(async (id: number) => {
      if (id === mockProductId) return Promise.resolve(mockProduct);
      throw new NotFoundException(`ComplementaryProduct with id ${id} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ComplementaryProductController],
      providers: [{ provide: ComplementaryProductService, useValue: mockService }],
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

  describe('GET /complementary-product', () => {
    it('should return all complementary products', async () => {
      const response = await request(app.getHttpServer()).get('/complementary-product').expect(200);
      expect(response.body).toEqual(mockProducts);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /complementary-product/:id', () => {
    it('should return a complementary product by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/complementary-product/${mockProductId}`).expect(200);
      expect(response.body).toEqual(mockProduct);
      expect(mockService.findOne).toHaveBeenCalledWith(mockProductId);
    });

    it('should return 404 if complementary product is not found', async () => {
      await request(app.getHttpServer())
        .get(`/complementary-product/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('POST /complementary-product', () => {
    it('should create a new complementary product', async () => {
      const createDto = { name: 'New Product', price: 15.0, quantity: 10 };
      const response = await request(app.getHttpServer()).post('/complementary-product').send(createDto).expect(201);
      expect(response.body).toEqual({ id: 2, ...createDto });
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('should return 400 for invalid data', async () => {
      const createDto = { name: '', price: -5, quantity: 0 }; 
      await request(app.getHttpServer()).post('/complementary-product').send(createDto).expect(400);
    });
  });

  describe('PATCH /complementary-product/:id', () => {
    it('should update a complementary product', async () => {
      const updateDto = { name: 'Updated Product', price: 20.0, quantity: 15 };
      const response = await request(app.getHttpServer())
        .patch(`/complementary-product/${mockProductId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockProductId, ...updateDto });
      expect(mockService.update).toHaveBeenCalledWith(mockProductId, updateDto);
    });

    it('should return 400 for invalid data', async () => {
      const updateDto = { name: '', price: -5, quantity: 0 }; 
      await request(app.getHttpServer())
        .patch(`/complementary-product/${mockProductId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should return 404 if complementary product is not found', async () => {
      const updateDto = { name: 'Updated Product', price: 20.0, quantity: 15 };
      await request(app.getHttpServer())
        .patch(`/complementary-product/${nonExistentId}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /complementary-product/:id', () => {
    it('should delete a complementary product', async () => {
      const response = await request(app.getHttpServer()).delete(`/complementary-product/${mockProductId}`).expect(200);
      expect(response.body).toEqual(mockProduct);
      expect(mockService.remove).toHaveBeenCalledWith(mockProductId);
    });

    it('should return 404 if complementary product is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/complementary-product/${nonExistentId}`)
        .expect(404);
    });
  });
});