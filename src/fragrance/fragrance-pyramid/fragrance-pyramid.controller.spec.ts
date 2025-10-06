import { Test, TestingModule } from '@nestjs/testing';
import { FragrancePyramidController } from './fragrance-pyramid.controller';
import { FragrancePyramidService } from './fragrance-pyramid.service';
import { CreateFragrancePyramidDto } from './dto/create-fragrance-pyramid.dto';
import { UpdateFragrancePyramidDto } from './dto/update-fragrance-pyramid.dto';

describe('FragrancePyramidController', () => {
  let controller: FragrancePyramidController;
  let service: FragrancePyramidService;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FragrancePyramidController],
      providers: [
        {
          provide: FragrancePyramidService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FragrancePyramidController>(FragrancePyramidController);
    service = module.get<FragrancePyramidService>(FragrancePyramidService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateFragrancePyramidDto = {
        fragranceId: 'uuid-fragrance',
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllFragrancePyramids', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', top: 'Citrus', heart: 'Floral', base: 'Woody' },
      ];

      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAllFragrancePyramids();

      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('findByFragrancePyramidId', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', top: 'Citrus', heart: 'Floral', base: 'Woody' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findByFragrancePyramidId('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateFragrancePyramidDto = { top: 'Updated Citrus' };
      const mockResult = { id: 'uuid', top: 'Updated Citrus', heart: 'Floral', base: 'Woody' };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', top: 'Citrus', heart: 'Floral', base: 'Woody' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});