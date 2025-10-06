import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConceptualCategoryService } from '../../src/scent_profiles/conceptual-category/conceptual-category.service';
import { ConceptualCategoryController } from '../../src/scent_profiles/conceptual-category/conceptual-category.controller';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

const mockCategoryId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
const mockCategory = { id: mockCategoryId, name: 'Floral' };
const mockCategories = [mockCategory];

const mockCategoryService = {
  findAll: jest.fn().mockResolvedValue(mockCategories),
  findById: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockCategoryId) return Promise.resolve(mockCategory);
    throw new NotFoundException(`ConceptualCategory with id ${id} not found`);
  }),
  create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
  update: jest.fn().mockImplementation(async (id, dto) => ({ id, ...dto })),
  delete: jest.fn().mockResolvedValue(mockCategory),
};

const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };

describe('ConceptualCategoryController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ConceptualCategoryController],
      providers: [{ provide: ConceptualCategoryService, useValue: mockCategoryService }],
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

  describe('GET /conceptual-category', () => {
    it('should return all conceptual categories', async () => {
      const response = await request(app.getHttpServer()).get('/conceptual-category').expect(200);
      expect(response.body).toEqual(mockCategories);
      expect(mockCategoryService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /conceptual-category/:id', () => {
    it('should return a conceptual category by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/conceptual-category/${mockCategoryId}`).expect(200);
      expect(response.body).toEqual(mockCategory);
      expect(mockCategoryService.findById).toHaveBeenCalledWith(mockCategoryId);
    });

    it('should return 404 if conceptual category is not found', async () => {
      await request(app.getHttpServer())
        .get('/conceptual-category/11111111-2222-3333-4444-555555555555')
        .expect(404);
    });
  });

  describe('POST /conceptual-category', () => {
    it('should create a new conceptual category', async () => {
      const createDto = { name: 'Woody' };
      const response = await request(app.getHttpServer()).post('/conceptual-category').send(createDto).expect(201);
      expect(response.body).toEqual({ id: 'new-id', ...createDto });
      expect(mockCategoryService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('PATCH /conceptual-category/:id', () => {
    it('should update a conceptual category', async () => {
      const updateDto = { name: 'Updated Name' };
      const response = await request(app.getHttpServer()).patch(`/conceptual-category/${mockCategoryId}`).send(updateDto).expect(200);
      expect(response.body).toEqual({ id: mockCategoryId, ...updateDto });
      expect(mockCategoryService.update).toHaveBeenCalledWith(mockCategoryId, updateDto);
    });
  });

  describe('DELETE /conceptual-category/:id', () => {
    it('should delete a conceptual category', async () => {
      const response = await request(app.getHttpServer()).delete(`/conceptual-category/${mockCategoryId}`).expect(200);
      expect(response.body).toEqual(mockCategory);
      expect(mockCategoryService.delete).toHaveBeenCalledWith(mockCategoryId);
    });
  });
});