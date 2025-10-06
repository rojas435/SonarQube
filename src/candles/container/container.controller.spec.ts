import { Test, TestingModule } from '@nestjs/testing';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { NotFoundException } from '@nestjs/common';

describe('ContainerController', () => {
  let controller: ContainerController;
  let service: ContainerService;

  const mockService = {
    getAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainerController],
      providers: [
        {
          provide: ContainerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContainerController>(ContainerController);
    service = module.get<ContainerService>(ContainerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllContainers', () => {
    it('should return all containers', async () => {
      const mockContainers = [
        { id: 'uuid-1', name: 'Container 1', image_url: 'url1' },
        { id: 'uuid-2', name: 'Container 2', image_url: 'url2' },
      ];

      mockService.getAll.mockResolvedValue(mockContainers);

      const result = await controller.getAllContainers({});
      expect(result).toEqual(mockContainers);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getContainerById', () => {
    it('should return a container by ID', async () => {
      const mockContainer = { id: 'uuid-1', name: 'Container 1', image_url: 'url1' };

      mockService.findById.mockResolvedValue(mockContainer);

      const result = await controller.getContainerById('uuid-1');
      expect(result).toEqual(mockContainer);
      expect(service.findById).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw an error if container is not found', async () => {
      mockService.findById.mockRejectedValue(new NotFoundException('Container with id uuid-1 not found'));

      await expect(controller.getContainerById('uuid-1')).rejects.toThrow('Container with id uuid-1 not found');
      expect(service.findById).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('create', () => {
    it('should create a new container', async () => {
      const createDto = { name: 'New Container', image_url: 'url' };
      const mockContainer = { id: 'uuid-1', ...createDto };

      mockService.create.mockResolvedValue(mockContainer);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockContainer);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if creation fails', async () => {
      const createDto = { name: 'New Container', image_url: 'url' };

      mockService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Creation failed');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a container', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };
      const mockContainer = { id: 'uuid-1', ...updateDto };

      mockService.update.mockResolvedValue(mockContainer);

      const result = await controller.update('uuid-1', updateDto);
      expect(result).toEqual(mockContainer);
      expect(service.update).toHaveBeenCalledWith('uuid-1', updateDto);
    });

    it('should throw an error if container to update is not found', async () => {
      const updateDto = { name: 'Updated Container', image_url: 'updated-url' };

      mockService.update.mockRejectedValue(new NotFoundException('Container with id uuid-1 not found'));

      await expect(controller.update('uuid-1', updateDto)).rejects.toThrow('Container with id uuid-1 not found');
      expect(service.update).toHaveBeenCalledWith('uuid-1', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a container', async () => {
      const mockContainer = { id: 'uuid-1', name: 'Container 1', image_url: 'url1' };

      mockService.delete.mockResolvedValue(mockContainer);

      const result = await controller.delete('uuid-1');
      expect(result).toEqual(mockContainer);
      expect(service.delete).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw an error if container to delete is not found', async () => {
      mockService.delete.mockRejectedValue(new NotFoundException('Container with id uuid-1 not found'));

      await expect(controller.delete('uuid-1')).rejects.toThrow('Container with id uuid-1 not found');
      expect(service.delete).toHaveBeenCalledWith('uuid-1');
    });
  });
});