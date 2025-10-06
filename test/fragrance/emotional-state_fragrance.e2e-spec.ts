import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { EmotionalStateFragranceController } from '../../src/fragrance/emotional-state_fragrance/emotional-state_fragrance.controller';
import { EmotionalStateFragranceService } from '../../src/fragrance/emotional-state_fragrance/emotional-state_fragrance.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('EmotionalStateFragranceController (E2E)', () => {
  let app: INestApplication;

  const mockFragranceId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const mockEmotionalStateId = 'b1c2d3e4-f5g6-7890-1234-567890abcdef';
  const mockEntityId = 'c1d2e3f4-g5h6-7890-1234-567890abcdef';

  const mockEntity = {
    id: mockEntityId,
    fragrance: { id: mockFragranceId, name: 'Fragrance1' },
    emotionalState: { id: mockEmotionalStateId, name: 'Happy' },
  };

  const mockEntities = [mockEntity];

  const mockService = {
    create: jest.fn().mockImplementation(async (dto) => {
      if (!dto.fragranceId || !dto.emotionalStateId) {
        throw new Error('Validation failed');
      }
      if (dto.fragranceId !== mockFragranceId || dto.emotionalStateId !== mockEmotionalStateId) {
        throw new NotFoundException(`Fragrance or EmotionalState not found`);
      }
      return { id: 'new-id', ...dto };
    }),
    findAll: jest.fn().mockResolvedValue(mockEntities),
    findByEmotionalStateAndFragranceId: jest.fn().mockImplementation(async (emotionalStateId, fragranceId) => {
      if (emotionalStateId === mockEmotionalStateId && fragranceId === mockFragranceId) {
        return mockEntity;
      }
      throw new NotFoundException(`EmotionalStateFragrance with emotionalStateId ${emotionalStateId} and fragranceId ${fragranceId} not found`);
    }),
    delete: jest.fn().mockImplementation(async (emotionalStateId, fragranceId) => {
      if (emotionalStateId === mockEmotionalStateId && fragranceId === mockFragranceId) {
        return mockEntity;
      }
      throw new NotFoundException(`EmotionalStateFragrance with emotionalStateId ${emotionalStateId} and fragranceId ${fragranceId} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmotionalStateFragranceController],
      providers: [{ provide: EmotionalStateFragranceService, useValue: mockService }],
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // describe('POST /emotional-state-fragrance', () => {
  //   it('should create a new EmotionalStateFragrance', async () => {
  //     const createDto = { fragranceId: mockFragranceId, emotionalStateId: mockEmotionalStateId };
  //     const response = await request(app.getHttpServer()).post('/emotional-state-fragrance').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { fragranceId: '', emotionalStateId: '' }; // Invalid data
  //     await request(app.getHttpServer()).post('/emotional-state-fragrance').send(createDto).expect(400);
  //   });

  //   it('should return 404 if fragrance or emotional state is not found', async () => {
  //     const createDto = { fragranceId: 'invalid-id', emotionalStateId: 'invalid-id' };
  //     await request(app.getHttpServer()).post('/emotional-state-fragrance').send(createDto).expect(404);
  //   });
  // });

  describe('GET /emotional-state-fragrance', () => {
    it('should return all EmotionalStateFragrance entities', async () => {
      const response = await request(app.getHttpServer()).get('/emotional-state-fragrance').expect(200);
      expect(response.body).toEqual(mockEntities);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /emotional-state-fragrance/:emotionalStateId/:fragranceId', () => {
    it('should return an EmotionalStateFragrance by emotionalStateId and fragranceId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/emotional-state-fragrance/${mockEmotionalStateId}/${mockFragranceId}`)
        .expect(200);
      expect(response.body).toEqual(mockEntity);
      expect(mockService.findByEmotionalStateAndFragranceId).toHaveBeenCalledWith(mockEmotionalStateId, mockFragranceId);
    });

    it('should return 404 if EmotionalStateFragrance is not found', async () => {
      await request(app.getHttpServer())
        .get('/emotional-state-fragrance/invalid-id/invalid-id')
        .expect(404);
    });
  });

  describe('DELETE /emotional-state-fragrance/:emotionalStateId/:fragranceId', () => {
    it('should delete an EmotionalStateFragrance', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/emotional-state-fragrance/${mockEmotionalStateId}/${mockFragranceId}`)
        .expect(200);
      expect(response.body).toEqual(mockEntity);
      expect(mockService.delete).toHaveBeenCalledWith(mockEmotionalStateId, mockFragranceId);
    });

    it('should return 404 if EmotionalStateFragrance is not found', async () => {
      await request(app.getHttpServer())
        .delete('/emotional-state-fragrance/invalid-id/invalid-id')
        .expect(404);
    });
  });
});