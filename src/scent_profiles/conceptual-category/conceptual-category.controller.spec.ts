import { Test, TestingModule } from '@nestjs/testing';
import { ConceptualCategoryController } from './conceptual-category.controller';
import { ConceptualCategoryService } from './conceptual-category.service';
import { CreateConceptualCategoryDto } from './dto/create-conceptual-category.dto';
import { UpdateConceptualCategoryDto } from './dto/update-conceptual-category.dto';

describe('ConceptualCategoryController', () => {
  let controller: ConceptualCategoryController;
  let service: ConceptualCategoryService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptualCategoryController],
      providers: [
        {
          provide: ConceptualCategoryService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ConceptualCategoryController>(ConceptualCategoryController);
    service = module.get<ConceptualCategoryService>(ConceptualCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'Category 1' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const mockResult = [{ id: 'uuid', name: 'Category 1' }];

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Category 1' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findById('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateConceptualCategoryDto = { name: 'Updated Category' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Category 1' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});