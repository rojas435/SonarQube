import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { OrderItemController } from '../../src/order_process/order-item/order-item.controller';
import { OrderItemService } from '../../src/order_process/order-item/order-item.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('OrderItemController (E2E)', () => {
  let app: INestApplication;

  const mockOrderItemId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID
  const nonExistentId = '11111111-2222-3333-4444-555555555555'; // Valid UUID
  const mockOrderItem = {
    id: mockOrderItemId,
    orderId: 'uuid-order',
    customCandleId: 'uuid-candle',
    quantity: 2,
    subtotal: 50.0,
  };
  const mockOrderItems = [mockOrderItem];

  const mockService = {
    getAll: jest.fn().mockResolvedValue(mockOrderItems),
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockOrderItemId) return Promise.resolve(mockOrderItem);
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
    update: jest.fn().mockImplementation(async (id: string, dto) => {
      if (id === mockOrderItemId) return { id, ...dto };
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }),
    delete: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockOrderItemId) return Promise.resolve(mockOrderItem);
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [{ provide: OrderItemService, useValue: mockService }],
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

  describe('GET /order-item', () => {
    it('should return all order items', async () => {
      const response = await request(app.getHttpServer()).get('/order-item').expect(200);
      expect(response.body).toEqual(mockOrderItems);
      expect(mockService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /order-item/:id', () => {
    it('should return an order item by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/order-item/${mockOrderItemId}`).expect(200);
      expect(response.body).toEqual(mockOrderItem);
      expect(mockService.findById).toHaveBeenCalledWith(mockOrderItemId);
    });

    it('should return 404 if order item is not found', async () => {
      await request(app.getHttpServer())
        .get(`/order-item/${nonExistentId}`)
        .expect(404);
    });
  });

  // describe('POST /order-item', () => {
  //   it('should create a new order item', async () => {
  //     const createDto = {
  //       orderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Valid UUID
  //       customCandleId: 'b1c2d3e4-f5g6-7890-1234-567890abcdef', // Valid UUID
  //       quantity: 2,
  //     };
  //     const response = await request(app.getHttpServer()).post('/order-item').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { orderId: '', customCandleId: '', quantity: 0 }; // Invalid data
  //     await request(app.getHttpServer()).post('/order-item').send(createDto).expect(400);
  //   });
  // });

  describe('PATCH /order-item/:id', () => {
    it('should update an order item', async () => {
      const updateDto = { quantity: 3, subtotal: 75.0 };
      const response = await request(app.getHttpServer())
        .patch(`/order-item/${mockOrderItemId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockOrderItemId, ...updateDto });
      expect(mockService.update).toHaveBeenCalledWith(mockOrderItemId, updateDto);
    });

    it('should return 400 for invalid data', async () => {
      const updateDto = { quantity: 0, subtotal: -10 }; // Invalid data
      await request(app.getHttpServer())
        .patch(`/order-item/${mockOrderItemId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should return 404 if order item is not found', async () => {
      const updateDto = { quantity: 3, subtotal: 75.0 };
      await request(app.getHttpServer())
        .patch(`/order-item/${nonExistentId}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /order-item/:id', () => {
    it('should delete an order item', async () => {
      const response = await request(app.getHttpServer()).delete(`/order-item/${mockOrderItemId}`).expect(200);
      expect(response.body).toEqual(mockOrderItem);
      expect(mockService.delete).toHaveBeenCalledWith(mockOrderItemId);
    });

    it('should return 404 if order item is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/order-item/${nonExistentId}`)
        .expect(404);
    });
  });
});