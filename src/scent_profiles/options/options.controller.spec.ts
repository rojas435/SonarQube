import { Test, TestingModule } from '@nestjs/testing';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

describe('OptionsController', () => {
  let controller: OptionsController;
  let service: OptionsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionsController],
      providers: [
        {
          provide: OptionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OptionsController>(OptionsController);
    service = module.get<OptionsService>(OptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateOptionDto = {
        name: 'Option 1',
        conceptualCategoryId: 'uuid-category',
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', name: 'Option 1', conceptualCategory: {} },
      ];

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Option 1', conceptualCategory: {} };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findById('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateOptionDto = { name: 'Updated Option' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Option 1', conceptualCategory: {} };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});