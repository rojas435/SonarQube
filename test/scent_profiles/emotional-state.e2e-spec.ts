import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { EmotionalStateController } from '../../src/scent_profiles/emotional-state/emotional-state.controller';
import { EmotionalStateService } from '../../src/scent_profiles/emotional-state/emotional-state.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('EmotionalStateController (E2E)', () => {
  let app: INestApplication;

  const mockStateId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const mockOptionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid UUID for optionId
  const mockState = {
    id: mockStateId,
    name: 'Happy',
    description: 'Feeling happy',
    option: { id: mockOptionId, name: 'Option1' },
  };
  const mockStates = [mockState];

  const mockEmotionalStateService = {
    create: jest.fn().mockImplementation(async (dto) => {
      if (!dto.name || !dto.description || !dto.optionId) {
        throw new Error('Validation failed');
      }
      if (dto.optionId !== mockOptionId) {
        throw new NotFoundException(`Option with id ${dto.optionId} not found`);
      }
      return { id: 'new-id', ...dto };
    }),
    findAll: jest.fn().mockResolvedValue(mockStates),
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockStateId) return Promise.resolve(mockState);
      throw new NotFoundException(`EmotionalState with id ${id} not found`);
    }),
    update: jest.fn().mockImplementation(async (id, dto) => {
      if (id !== mockStateId) {
        throw new NotFoundException(`EmotionalState with id ${id} not found`);
      }
      return { id, ...dto };
    }),
    delete: jest.fn().mockImplementation(async (id) => {
      if (id !== mockStateId) {
        throw new NotFoundException(`EmotionalState with id ${id} not found`);
      }
      return mockState;
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmotionalStateController],
      providers: [{ provide: EmotionalStateService, useValue: mockEmotionalStateService }],
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

  // describe('POST /emotional-state', () => {
  //   it('should create a new emotional state', async () => {
  //     const createDto = { name: 'Happy', description: 'Feeling happy', optionId: mockOptionId }; // Valid UUID
  //     const response = await request(app.getHttpServer()).post('/emotional-state').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockEmotionalStateService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { name: '', description: '', optionId: 'invalid-uuid' }; // Invalid UUID
  //     await request(app.getHttpServer()).post('/emotional-state').send(createDto).expect(400);
  //   });

  //   it('should return 404 if optionId is not found', async () => {
  //     const createDto = { name: 'Happy', description: 'Feeling happy', optionId: '11111111-2222-3333-4444-555555555555' }; // Non-existent UUID
  //     await request(app.getHttpServer()).post('/emotional-state').send(createDto).expect(404);
  //   });
  // });

  describe('GET /emotional-state', () => {
    it('should return all emotional states', async () => {
      const response = await request(app.getHttpServer()).get('/emotional-state').expect(200);
      expect(response.body).toEqual(mockStates);
      expect(mockEmotionalStateService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /emotional-state/:id', () => {
    it('should return an emotional state by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/emotional-state/${mockStateId}`).expect(200);
      expect(response.body).toEqual(mockState);
      expect(mockEmotionalStateService.findById).toHaveBeenCalledWith(mockStateId);
    });

    it('should return 404 if emotional state is not found', async () => {
      await request(app.getHttpServer())
        .get('/emotional-state/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });

  describe('PATCH /emotional-state/:id', () => {
    it('should update an emotional state', async () => {
      const updateDto = { name: 'Excited', description: 'Feeling excited' };
      const response = await request(app.getHttpServer()).patch(`/emotional-state/${mockStateId}`).send(updateDto).expect(200);
      expect(response.body).toEqual({ id: mockStateId, ...updateDto });
      expect(mockEmotionalStateService.update).toHaveBeenCalledWith(mockStateId, updateDto);
    });

    it('should return 404 if emotional state is not found', async () => {
      const updateDto = { name: 'Excited', description: 'Feeling excited' };
      await request(app.getHttpServer())
        .patch('/emotional-state/11111111-2222-3333-4444-555555555555')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /emotional-state/:id', () => {
    it('should delete an emotional state', async () => {
      const response = await request(app.getHttpServer()).delete(`/emotional-state/${mockStateId}`).expect(200);
      expect(response.body).toEqual(mockState);
      expect(mockEmotionalStateService.delete).toHaveBeenCalledWith(mockStateId);
    });

    it('should return 404 if emotional state is not found', async () => {
      await request(app.getHttpServer())
        .delete('/emotional-state/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });
});