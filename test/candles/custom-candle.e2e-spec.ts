import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { CustomCandleController } from '../../src/candles/custom-candle/custom-candle.controller';
import { CustomCandleService } from '../../src/candles/custom-candle/custom-candle.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('CustomCandleController (E2E)', () => {
  let app: INestApplication;

  const mockCandleId = 'uuid-candle';
  const nonExistentId = 'non-existent-id';
  const mockCandle = {
    id: mockCandleId,
    containerId: 'uuid-container',
    fragranceId: 'uuid-fragrance',
    emotionalStateId: 'uuid-emotional-state',
    price: 25.5,
    quantity: 1,
    name: 'Custom Candle',
    status: 'pending',
  };
  const mockCandles = [mockCandle];

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockCandles),
    findOne: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockCandleId) return Promise.resolve(mockCandle);
      throw new NotFoundException(`CustomCandle with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
    update: jest.fn().mockImplementation(async (id: string, dto) => {
      if (id === mockCandleId) return { id, ...dto };
      throw new NotFoundException(`CustomCandle with id ${id} not found`);
    }),
    remove: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockCandleId) return Promise.resolve(mockCandle);
      throw new NotFoundException(`CustomCandle with id ${id} not found`);
    }),
    beautifyText: jest.fn().mockResolvedValue('Frase poética generada'),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CustomCandleController],
      providers: [{ provide: CustomCandleService, useValue: mockService }],
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

  describe('GET /custom-candle', () => {
    it('should return all custom candles', async () => {
      const response = await request(app.getHttpServer()).get('/custom-candle').expect(200);
      expect(response.body).toEqual(mockCandles);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /custom-candle/:id', () => {
    it('should return a custom candle by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/custom-candle/${mockCandleId}`).expect(200);
      expect(response.body).toEqual(mockCandle);
      expect(mockService.findOne).toHaveBeenCalledWith(mockCandleId);
    });

    it('should return 404 if custom candle is not found', async () => {
      await request(app.getHttpServer())
        .get(`/custom-candle/${nonExistentId}`)
        .expect(404);
    });
  });

  // describe('POST /custom-candle', () => {
  //   it('should create a new custom candle', async () => {
  //     const createDto = {
  //       containerId: 'uuid-container',
  //       fragranceId: 'uuid-fragrance',
  //       emotionalStateId: 'uuid-emotional-state',
  //       price: 30.0,
  //       quantity: 2,
  //       name: 'New Candle',
  //     };
  //     const response = await request(app.getHttpServer()).post('/custom-candle').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { containerId: '', fragranceId: '', price: -5, quantity: 0 }; // Invalid data
  //     await request(app.getHttpServer()).post('/custom-candle').send(createDto).expect(400);
  //   });
  // });

  describe('PATCH /custom-candle/:id', () => {
    it('should update a custom candle', async () => {
      const updateDto = { name: 'Updated Candle', price: 35.0 };
      const response = await request(app.getHttpServer())
        .patch(`/custom-candle/${mockCandleId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockCandleId, ...updateDto });
      expect(mockService.update).toHaveBeenCalledWith(mockCandleId, updateDto);
    });

    // it('should return 400 for invalid data', async () => {
    //   const updateDto = { name: '', price: -10 }; 
    //   await request(app.getHttpServer())
    //     .patch(`/custom-candle/${mockCandleId}`)
    //     .send(updateDto)
    //     .expect(400);
    // });

    it('should return 404 if custom candle is not found', async () => {
      const updateDto = { name: 'Updated Candle', price: 35.0 };
      await request(app.getHttpServer())
        .patch(`/custom-candle/${nonExistentId}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /custom-candle/:id', () => {
    it('should delete a custom candle', async () => {
      const response = await request(app.getHttpServer()).delete(`/custom-candle/${mockCandleId}`).expect(200);
      expect(response.body).toEqual(mockCandle);
      expect(mockService.remove).toHaveBeenCalledWith(mockCandleId);
    });

    it('should return 404 if custom candle is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/custom-candle/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('POST /custom-candle/beautify', () => {
    it('should return a beautified text', async () => {
        const prompt = { text: 'Create a poetic phrase for a candle' };
        const response = await request(app.getHttpServer()).post('/custom-candle/beautify').send(prompt).expect(201);
        expect(typeof response.body).toBe('object');
        expect(mockService.beautifyText).toHaveBeenCalledWith(prompt.text);
    });
  });
});