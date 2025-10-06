import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { FragrancePyramidController } from '../../src/fragrance/fragrance-pyramid/fragrance-pyramid.controller';
import { FragrancePyramidService } from '../../src/fragrance/fragrance-pyramid/fragrance-pyramid.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FragranceController } from '../../src/fragrance/fragrance/fragrance.controller';
import { FragranceService } from '../../src/fragrance/fragrance/fragrance.service';
import { AppModule } from 'src/app.module';
import { validate as validateUUID } from 'uuid'; // Assuming you have a utility function to validate UUIDs

const mockFragranceId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID v4

const mockFragrancePyramidId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
const mockFragrancePyramid = {
  id: mockFragrancePyramidId,
  fragranceId: mockFragranceId,
  top: 'Citrus',
  heart: 'Floral',
  base: 'Woody',
};

const mockFragrancePyramids = [mockFragrancePyramid];

const mockFragrancePyramidService = {
  create: jest.fn().mockImplementation(async (dto) => {
    console.log('Received DTO:', dto);
    if (dto.fragranceId !== mockFragranceId) {
      throw new NotFoundException(`Fragrance with id ${dto.fragranceId} not found`);
    }
    return { id: 'new-id', ...dto };
  }),
  getAll: jest.fn().mockResolvedValue(mockFragrancePyramids),
  findById: jest.fn().mockImplementation(async (id: string) => {
    if (id === mockFragrancePyramidId) return Promise.resolve(mockFragrancePyramid);
    throw new NotFoundException(`Fragrance Pyramid with id ${id} not found`);
  }),
  update: jest.fn().mockImplementation(async (id, dto) => ({ id, ...dto })),
  delete: jest.fn().mockResolvedValue(mockFragrancePyramid),
};

const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };

describe('FragrancePyramidController (E2E)', () => {
  let app: INestApplication;

  const mockFragranceService = {
    create: jest.fn().mockResolvedValue({ id: mockFragranceId, name: 'Rose' }),
  };
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FragrancePyramidController, FragranceController], // Include FragranceController
      providers: [
        { provide: FragrancePyramidService, useValue: mockFragrancePyramidService },
        { provide: FragranceService, useValue: mockFragranceService }, // Mock the FragranceService
      ],
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

  // describe('POST /fragrance-pyramid', () => {
  //   it('should create a new fragrance pyramid', async () => {
  //     const createDto = { fragranceId: mockFragranceId, top: 'Citrus', heart: 'Floral', base: 'Woody' };
  //     const response = await request(app.getHttpServer())
  //       .post('/fragrance-pyramid')
  //       .send(createDto)
  //       .expect(201);
  //     expect(response.body).toEqual({ id: 'new-id', ...createDto });
  //     expect(mockFragrancePyramidService.create).toHaveBeenCalledWith(createDto);
  //   });
  // });

  describe('GET /fragrance-pyramid', () => {
    it('should return all fragrance pyramids', async () => {
      const response = await request(app.getHttpServer()).get('/fragrance-pyramid').expect(200);
      expect(response.body).toEqual(mockFragrancePyramids);
      expect(mockFragrancePyramidService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /fragrance-pyramid/:id', () => {
    it('should return a fragrance pyramid by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fragrance-pyramid/${mockFragrancePyramidId}`)
        .expect(200);
      expect(response.body).toEqual(mockFragrancePyramid);
      expect(mockFragrancePyramidService.findById).toHaveBeenCalledWith(mockFragrancePyramidId);
    });

    it('should return 404 if fragrance pyramid is not found', async () => {
      await request(app.getHttpServer())
        .get('/fragrance-pyramid/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /fragrance-pyramid/:id', () => {
    it('should update a fragrance pyramid', async () => {
      const updateDto = { top: 'Updated Top', heart: 'Updated Heart', base: 'Updated Base' };
      const response = await request(app.getHttpServer())
        .patch(`/fragrance-pyramid/${mockFragrancePyramidId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockFragrancePyramidId, ...updateDto });
    });
  });

  describe('DELETE /fragrance-pyramid/:id', () => {
    it('should delete a fragrance pyramid', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/fragrance-pyramid/${mockFragrancePyramidId}`)
        .expect(200);
      expect(response.body).toEqual(mockFragrancePyramid);
      expect(mockFragrancePyramidService.delete).toHaveBeenCalledWith(mockFragrancePyramidId);
    });
  });
});