import { Test, TestingModule } from '@nestjs/testing';
import { FragranceController } from './fragrance.controller';
import { FragranceService } from './fragrance.service';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';

describe('FragranceController', () => {
  let controller: FragranceController;
  let service: FragranceService;

  const mockService = {
    getAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FragranceController],
      providers: [
        {
          provide: FragranceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FragranceController>(FragranceController);
    service = module.get<FragranceService>(FragranceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFragrance', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [{ id: 'uuid', name: 'Fragrance 1' }];
      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAllFragrance({});

      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('getFragranceById', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Fragrance 1' };
      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.getFragranceById('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateFragranceDto = { name: 'Fragrance 1' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateFragranceDto = { name: 'Updated Fragrance' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Fragrance 1' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});