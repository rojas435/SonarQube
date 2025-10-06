import { Test, TestingModule } from '@nestjs/testing';
import { ConceptualCategoryService } from './conceptual-category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptualCategory } from './entities/conceptual-category.entity';
import { CreateConceptualCategoryDto } from './dto/create-conceptual-category.dto';
import { UpdateConceptualCategoryDto } from './dto/update-conceptual-category.dto';

describe('ConceptualCategoryService', () => {
  let service: ConceptualCategoryService;

  const mockConceptualCategoryRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConceptualCategoryService,
        {
          provide: getRepositoryToken(ConceptualCategory),
          useValue: mockConceptualCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ConceptualCategoryService>(ConceptualCategoryService);

    Object.values(mockConceptualCategoryRepository).forEach((fn) => fn.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save and return the conceptual category', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'Floral' };
      const saved = { id: '1', ...dto };

      mockConceptualCategoryRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(mockConceptualCategoryRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(saved);
    });

    it('should throw an error if name is not unique', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'Floral' };

      mockConceptualCategoryRepository.save.mockRejectedValue(
        new Error('ConceptualCategory with name Floral already exists'),
      );

      await expect(service.create(dto)).rejects.toThrow(
        `ConceptualCategory with name ${dto.name} already exists`,
      );
    });

    it('should throw an error if name is too long', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'a'.repeat(256) };
    
      mockConceptualCategoryRepository.save.mockRejectedValue(
        new Error('Value too long for type character varying(255)'),
      );
    
      await expect(service.create(dto)).rejects.toThrow(
        'Value too long for type character varying(255)',
      );
    });
    
    it('should throw a BadRequestException for null value in a column', async () => {
      const dto: CreateConceptualCategoryDto = { name: '' };
    
      mockConceptualCategoryRepository.save.mockRejectedValue({
        code: '23502',
        column: 'name',
      });
    
      await expect(service.create(dto)).rejects.toThrow(
        'Null value in column "name" violates not-null constraint',
      );
    });
    
    it('should throw a ConflictException for duplicate name', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'Floral' };
    
      mockConceptualCategoryRepository.save.mockRejectedValue({
        message: 'duplicate key value violates unique constraint',
      });
    
      await expect(service.create(dto)).rejects.toThrow(
        `ConceptualCategory with name ${dto.name} already exists`,
      );
    });
    
    it('should throw a BadRequestException for value too long', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'a'.repeat(256) };
    
      mockConceptualCategoryRepository.save.mockRejectedValue({
        message: 'value too long for type character varying(255)',
      });
    
      await expect(service.create(dto)).rejects.toThrow(
        'Value too long for type character varying(255)',
      );
    });
    
    it('should throw a generic BadRequestException for other errors', async () => {
      const dto: CreateConceptualCategoryDto = { name: 'Floral' };
    
      mockConceptualCategoryRepository.save.mockRejectedValue({
        message: 'Some other error',
      });
    
      await expect(service.create(dto)).rejects.toThrow(
        'Error creating conceptual category: Some other error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all conceptual categories', async () => {
      const data = [
        { id: '1', name: 'Floral' },
        { id: '2', name: 'Woody' },
      ];

      mockConceptualCategoryRepository.find.mockResolvedValue(data);

      const result = await service.findAll();

      expect(result).toEqual(data);
    });
  });

  describe('findById', () => {
    it('should return one conceptual category by ID', async () => {
      const category = { id: '1', name: 'Floral' };

      mockConceptualCategoryRepository.findOneBy.mockResolvedValue(category);

      const result = await service.findById('1');

      expect(result).toEqual(category);
    });

    it('should throw an error if conceptual category not found', async () => {
      mockConceptualCategoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('ConceptualCategory with id 1 not found');
    });
  });

  describe('update', () => {
    it('should update and return the conceptual category', async () => {
      const originalCategory = { id: '1', name: 'Old Floral' };
      const updatedCategory = { ...originalCategory, name: 'New Floral' };

      mockConceptualCategoryRepository.update.mockResolvedValue({ affected: 1 });
      mockConceptualCategoryRepository.findOneBy.mockResolvedValue(updatedCategory);

      const result = await service.update('1', { name: 'New Floral' });

      expect(mockConceptualCategoryRepository.update).toHaveBeenCalledWith('1', { name: 'New Floral' });
      expect(result).toEqual(updatedCategory);
    });

    it('should throw an error if conceptual category not found', async () => {
      mockConceptualCategoryRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('1', { name: 'New Floral' })).rejects.toThrow(
        'ConceptualCategory with id 1 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a conceptual category and return result', async () => {
      const category = { id: '1', name: 'Floral' };

      mockConceptualCategoryRepository.findOneBy.mockResolvedValue(category);
      mockConceptualCategoryRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');

      expect(result).toEqual(category);
      expect(mockConceptualCategoryRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if conceptual category not found', async () => {
      mockConceptualCategoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow('ConceptualCategory with id 1 not found');
    });
  });
});