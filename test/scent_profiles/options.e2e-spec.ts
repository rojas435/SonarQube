import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { OptionsController } from '../../src/scent_profiles/options/options.controller';
import { OptionsService } from '../../src/scent_profiles/options/options.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('OptionsController (E2E)', () => {
  let app: INestApplication;

  const mockOptionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const mockOption = { id: mockOptionId, name: 'Option1', conceptualCategory: { id: '1', name: 'Category1' } };
  const mockOptions = [mockOption];

  const mockOptionsService = {
    create: jest.fn().mockImplementation(async (dto) => {
      if (!dto.name || !dto.conceptualCategoryId) {
        throw new Error('Validation failed');
      }
      return { id: 'new-id', ...dto };
    }),
    findAll: jest.fn().mockResolvedValue(mockOptions),
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockOptionId) return Promise.resolve(mockOption);
      throw new NotFoundException(`Option with id ${id} not found`);
    }),
    update: jest.fn().mockImplementation(async (id, dto) => {
      if (id !== mockOptionId) {
        throw new NotFoundException(`Option with id ${id} not found`);
      }
      return { id, ...dto };
    }),
    delete: jest.fn().mockImplementation(async (id) => {
      if (id !== mockOptionId) {
        throw new NotFoundException(`Option with id ${id} not found`);
      }
      return mockOption;
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [{ provide: OptionsService, useValue: mockOptionsService }],
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

  // describe('POST /options', () => {
  //   it('should create a new option', async () => {
  //     const createDto = { name: 'Option1', conceptualCategoryId: '1' };
  //     const response = await request(app.getHttpServer()).post('/options').send(createDto).expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockOptionsService.create).toHaveBeenCalledWith(createDto);
  //   });

  //   it('should return 400 for invalid data', async () => {
  //     const createDto = { name: '', conceptualCategoryId: 'invalid-uuid' };
  //     await request(app.getHttpServer()).post('/options').send(createDto).expect(400);
  //   });
  // });

  describe('GET /options', () => {
    it('should return all options', async () => {
      const response = await request(app.getHttpServer()).get('/options').expect(200);
      expect(response.body).toEqual(mockOptions);
      expect(mockOptionsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /options/:id', () => {
    it('should return an option by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/options/${mockOptionId}`).expect(200);
      expect(response.body).toEqual(mockOption);
      expect(mockOptionsService.findById).toHaveBeenCalledWith(mockOptionId);
    });

    it('should return 404 if option is not found', async () => {
      await request(app.getHttpServer())
        .get('/options/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });

  describe('PATCH /options/:id', () => {
    it('should update an option', async () => {
      const updateDto = { name: 'UpdatedOption' };
      const response = await request(app.getHttpServer()).patch(`/options/${mockOptionId}`).send(updateDto).expect(200);
      expect(response.body).toEqual({ id: mockOptionId, ...updateDto });
      expect(mockOptionsService.update).toHaveBeenCalledWith(mockOptionId, updateDto);
    });

    it('should return 404 if option is not found', async () => {
      const updateDto = { name: 'UpdatedOption' };
      await request(app.getHttpServer())
        .patch('/options/11111111-2222-3333-4444-555555555555')
        .send(updateDto)
        .expect(404);
    });

    it('should return 400 for invalid data', async () => {
      const updateDto = { name: '' };
      await request(app.getHttpServer()).patch(`/options/${mockOptionId}`).send(updateDto).expect(400);
    });
  });

  describe('DELETE /options/:id', () => {
    it('should delete an option', async () => {
      const response = await request(app.getHttpServer()).delete(`/options/${mockOptionId}`).expect(200);
      expect(response.body).toEqual(mockOption);
      expect(mockOptionsService.delete).toHaveBeenCalledWith(mockOptionId);
    });

    it('should return 404 if option is not found', async () => {
      await request(app.getHttpServer())
        .delete('/options/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });
});