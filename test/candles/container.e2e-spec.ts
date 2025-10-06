import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { ContainerController } from '../../src/candles/container/container.controller';
import { ContainerService } from '../../src/candles/container/container.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('ContainerController (E2E)', () => {
  let app: INestApplication;

  const mockContainerId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
  const nonExistentId = '11111111-2222-3333-4444-555555555555'; // UUID válido pero no existente
  const mockContainer = { id: mockContainerId, name: 'Container 1', image_url: 'url1' };
  const mockContainers = [mockContainer];

  const mockContainerService = {
    getAll: jest.fn().mockResolvedValue(mockContainers),
    findById: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockContainerId) return Promise.resolve(mockContainer);
      throw new NotFoundException(`Container with id ${id} not found`);
    }),
    create: jest.fn().mockImplementation(async (dto) => ({ id: 'new-id', ...dto })),
    update: jest.fn().mockImplementation(async (id, dto) => {
      if (id === mockContainerId) return { id, ...dto };
      throw new NotFoundException(`Container with id ${id} not found`);
    }),
    delete: jest.fn().mockImplementation(async (id: string) => {
      if (id === mockContainerId) return Promise.resolve(mockContainer);
      throw new NotFoundException(`Container with id ${id} not found`);
    }),
  };

  const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
  const mockRolesGuard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ContainerController],
      providers: [{ provide: ContainerService, useValue: mockContainerService }],
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

  describe('GET /container', () => {
    it('should return all containers', async () => {
      const response = await request(app.getHttpServer()).get('/container').expect(200);
      expect(response.body).toEqual(mockContainers);
      expect(mockContainerService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /container/:id', () => {
    it('should return a container by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/container/${mockContainerId}`).expect(200);
      expect(response.body).toEqual(mockContainer);
      expect(mockContainerService.findById).toHaveBeenCalledWith(mockContainerId);
    });

    it('should return 404 if container is not found', async () => {
      await request(app.getHttpServer())
        .get(`/container/${nonExistentId}`) // UUID válido pero no existente
        .expect(404);
    });
  });

  describe('POST /container', () => {
    it('should create a new container', async () => {
      const createDto = { name: 'New Container', image_url: 'url' };
      const response = await request(app.getHttpServer()).post('/container').send(createDto).expect(201);
      expect(response.body).toEqual({ id: 'new-id', ...createDto });
      expect(mockContainerService.create).toHaveBeenCalledWith(createDto);
    });

    it('should return 400 for invalid data', async () => {
      const createDto = { name: '', image_url: '' }; // Datos inválidos
      await request(app.getHttpServer()).post('/container').send(createDto).expect(400);
    });
  });

  describe('PATCH /container/:id', () => {
    it('should update a container', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };
      const response = await request(app.getHttpServer())
        .patch(`/container/${mockContainerId}`)
        .send(updateDto)
        .expect(200);
      expect(response.body).toEqual({ id: mockContainerId, ...updateDto });
      expect(mockContainerService.update).toHaveBeenCalledWith(mockContainerId, updateDto);
    });

    it('should return 404 if container is not found', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };
      await request(app.getHttpServer())
        .patch(`/container/${nonExistentId}`) // UUID válido pero no existente
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /container/:id', () => {
    it('should delete a container', async () => {
      const response = await request(app.getHttpServer()).delete(`/container/${mockContainerId}`).expect(200);
      expect(response.body).toEqual(mockContainer);
      expect(mockContainerService.delete).toHaveBeenCalledWith(mockContainerId);
    });

    it('should return 404 if container is not found', async () => {
      await request(app.getHttpServer())
        .delete(`/container/${nonExistentId}`) // UUID válido pero no existente
        .expect(404);
    });
  });
});