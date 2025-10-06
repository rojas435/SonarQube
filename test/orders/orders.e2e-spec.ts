import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { OrdersController } from '../../src/order_process/orders/orders.controller';
import { OrdersService } from '../../src/order_process/orders/orders.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('OrdersController (E2E)', () => {
  let app: INestApplication;

  const mockOrderId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID
  const nonExistentId = '11111111-2222-3333-4444-555555555555'; // Valid UUID
  const mockOrder = {
    id: mockOrderId,
    totalAmount: 100.0,
    status: 'pending',
    shippingAddress: '123 Main St',
    paymentMethod: 'credit card',
    notes: 'Deliver ASAP',
  };
  const mockOrders = [mockOrder];

  const mockService = {
    getAll: jest.fn().mockResolvedValue(mockOrders),
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockOrderId) return Promise.resolve(mockOrder);
      throw new NotFoundException(`Order with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
    update: jest.fn().mockImplementation(async (id: string, dto) => {
      if (id === mockOrderId) return { id, ...dto };
      throw new NotFoundException(`Order with id ${id} not found`);
    }),
    delete: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockOrderId) return Promise.resolve(mockOrder);
      throw new NotFoundException(`Order with id ${id} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockService }],
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

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const response = await request(app.getHttpServer()).get('/orders').expect(200);
      expect(response.body).toEqual(mockOrders);
      expect(mockService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return an order by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/orders/${mockOrderId}`).expect(200);
      expect(response.body).toEqual(mockOrder);
      expect(mockService.findById).toHaveBeenCalledWith(mockOrderId);
    });

    it('should return 404 if order is not found', async () => {
      await request(app.getHttpServer())
        .get(`/orders/${nonExistentId}`)
        .expect(404);
    });
  });

  // describe('POST /orders', () => {
  //   it('should create a new order', async () => {
  //       const createDto = {
  //       userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Valid UUID for userId
  //       totalAmount: 100.0,
  //       status: 'pending',
  //       shippingAddress: '123 Main St',
  //       paymentMethod: 'credit card',
  //       notes: 'Deliver ASAP',
  //       };
  //       const response = await request(app.getHttpServer()).post('/orders').send(createDto).expect(201);
  //       expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //       expect(mockService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //       const createDto = { totalAmount: -100 }; // Invalid data
  //       await request(app.getHttpServer()).post('/orders').send(createDto).expect(400);
  //   });
  // });

  describe('PATCH /orders/:id', () => {
    it('should update an order', async () => {
      const updateDto = { status: 'completed' };
      const response = await request(app.getHttpServer())
        .patch(`/orders/${mockOrderId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockOrderId, ...updateDto });
      expect(mockService.update).toHaveBeenCalledWith(mockOrderId, updateDto);
    });

    it('should return 400 for invalid data', async () => {
      const updateDto = { totalAmount: -100 }; // Invalid data
      await request(app.getHttpServer())
        .patch(`/orders/${mockOrderId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should return 404 if order is not found', async () => {
      const updateDto = { status: 'completed' };
      await request(app.getHttpServer())
        .patch(`/orders/${nonExistentId}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order', async () => {
      const response = await request(app.getHttpServer()).delete(`/orders/${mockOrderId}`).expect(200);
      expect(response.body).toEqual(mockOrder);
      expect(mockService.delete).toHaveBeenCalledWith(mockOrderId);
    });

    it('should return 404 if order is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/orders/${nonExistentId}`)
        .expect(404);
    });
  });
});