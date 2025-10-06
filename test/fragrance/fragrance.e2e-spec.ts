import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FragranceService } from '../../src/fragrance/fragrance/fragrance.service';
import { FragranceController } from '../../src/fragrance/fragrance/fragrance.controller';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

const mockFragranceId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
const mockFragrance = { id: mockFragranceId, name: 'Lavender' };
const mockFragrances = [mockFragrance];

const mockFragranceService = {
  getAll: jest.fn().mockResolvedValue(mockFragrances),
  findById: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockFragranceId) return Promise.resolve(mockFragrance);
    throw new NotFoundException(`Fragrance with id ${id} not found`);
  }),
  create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
  update: jest.fn().mockImplementation(async (id, dto) => ({ id, ...dto })),
  delete: jest.fn().mockResolvedValue(mockFragrance),
};

const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };

describe('FragranceController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FragranceController],
      providers: [{ provide: FragranceService, useValue: mockFragranceService }],
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

  describe('GET /fragrance', () => {
    it('should return all fragrances', async () => {
      const response = await request(app.getHttpServer()).get('/fragrance').expect(200);
      expect(response.body).toEqual(mockFragrances);
      expect(mockFragranceService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /fragrance/:id', () => {
    it('should return a fragrance by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/fragrance/${mockFragranceId}`).expect(200);
      expect(response.body).toEqual(mockFragrance);
      expect(mockFragranceService.findById).toHaveBeenCalledWith(mockFragranceId);
    });

    it('should return 404 if fragrance is not found', async () => {
      await request(app.getHttpServer())
        .get('/fragrance/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });

  describe('POST /fragrance', () => {
    it('should create a new fragrance', async () => {
      const createDto = { name: 'Rose' };
      const response = await request(app.getHttpServer()).post('/fragrance').send(createDto).expect(201);
      expect(response.body).toEqual({ id: 'new-id', ...createDto });
      expect(mockFragranceService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('PATCH /fragrance/:id', () => {
    it('should update a fragrance', async () => {
      const updateDto = { name: 'Updated Name' };
      const response = await request(app.getHttpServer()).patch(`/fragrance/${mockFragranceId}`).send(updateDto).expect(200);
      expect(response.body).toEqual({ id: mockFragranceId, ...updateDto });
      expect(mockFragranceService.update).toHaveBeenCalledWith(mockFragranceId, updateDto);
    });
  });

  describe('DELETE /fragrance/:id', () => {
    it('should delete a fragrance', async () => {
      const response = await request(app.getHttpServer()).delete(`/fragrance/${mockFragranceId}`).expect(200);
      expect(response.body).toEqual(mockFragrance);
      expect(mockFragranceService.delete).toHaveBeenCalledWith(mockFragranceId);
    });
  });
});