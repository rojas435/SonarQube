import { Test, TestingModule } from '@nestjs/testing';
import { ContainerService } from './container.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Container } from './entities/container.entity';
import { NotFoundException } from '@nestjs/common';

describe('ContainerService', () => {
  let service: ContainerService;
  let repository: jest.Mocked<Repository<Container>>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContainerService,
        {
          provide: getRepositoryToken(Container),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContainerService>(ContainerService);
    repository = module.get(getRepositoryToken(Container));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new container', async () => {
      const createDto = { name: 'New Container', image_url: 'url' };
      const mockContainer = { id: 'uuid-1', ...createDto };

      repository.save.mockResolvedValue(mockContainer);

      const result = await service.create(createDto);

      expect(result).toEqual(mockContainer);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if creation fails', async () => {
      const createDto = { name: 'New Container', image_url: 'url' };

      repository.save.mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createDto)).rejects.toThrow('Creation failed');
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAll', () => {
    it('should return all containers', async () => {
      const mockContainers = [
        { id: 'uuid-1', name: 'Container 1', image_url: 'url1' },
        { id: 'uuid-2', name: 'Container 2', image_url: 'url2' },
      ];

      repository.find.mockResolvedValue(mockContainers);

      const result = await service.getAll();

      expect(result).toEqual(mockContainers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a container by ID', async () => {
      const mockContainer = { id: 'uuid-1', name: 'Container 1', image_url: 'url1' };

      repository.findOneBy.mockResolvedValue(mockContainer);

      const result = await service.findById('uuid-1');

      expect(result).toEqual(mockContainer);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });

    it('should throw an error if container is not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('uuid-1')).rejects.toThrow('Container with id uuid-1 not found');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });
  });

  describe('update', () => {
    it('should update a container', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };
      const mockContainer = { id: 'uuid-1', ...updateDto };

      const updateResult: UpdateResult = {
        affected: 1, raw: {},
        generatedMaps: []
      };
      repository.update.mockResolvedValue(updateResult);
      repository.findOneBy.mockResolvedValue(mockContainer);

      const result = await service.update('uuid-1', updateDto);

      expect(result).toEqual(mockContainer);
      expect(repository.update).toHaveBeenCalledWith('uuid-1', updateDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });

    it('should throw an error if container to update is not found', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };
  
      const updateResult: UpdateResult = {
        affected: 0, // Simula que no se actualizó ningún registro
        raw: {},
        generatedMaps: [],
      };
      repository.update.mockResolvedValue(updateResult);
  
      await expect(service.update('uuid-1', updateDto)).rejects.toThrow('Container with id uuid-1 not found');
      expect(repository.update).toHaveBeenCalledWith('uuid-1', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a container', async () => {
      const mockContainer = { id: 'uuid-1', name: 'Container 1', image_url: 'url1' };
  
      repository.findOneBy.mockResolvedValue(mockContainer);
      repository.delete.mockResolvedValue({ affected: 1, raw: {} }); // Ajuste aquí
  
      const result = await service.delete('uuid-1');
  
      expect(result).toEqual(mockContainer);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(repository.delete).toHaveBeenCalledWith('uuid-1');
    });
  
    it('should throw an error if container to delete is not found', async () => {
      repository.findOneBy.mockResolvedValue(null);
  
      await expect(service.delete('uuid-1')).rejects.toThrow('Container with id uuid-1 not found');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });
  });
});