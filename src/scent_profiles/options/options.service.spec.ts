import { Test, TestingModule } from '@nestjs/testing';
import { OptionsService } from './options.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

describe('OptionsService', () => {
  let service: OptionsService;

  const mockOptionsRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    manager: {
      findOne: jest.fn(), 
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionsService,
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionsRepository,
        },
      ],
    }).compile();

    service = module.get<OptionsService>(OptionsService);

    Object.values(mockOptionsRepository)
      .forEach((fn) => {
        if (typeof fn === 'function' && fn.mockReset) {
          fn.mockReset();
        }
      });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new option', async () => {
      const dto: CreateOptionDto = { name: 'Option1', conceptualCategoryId: '1' };
      const conceptualCategory = { id: '1', name: 'Category1' };
      const newOption = { name: 'Option1', conceptualCategory };
      const savedOption = { id: '1', ...newOption };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(conceptualCategory);
      mockOptionsRepository.create.mockReturnValue(newOption);
      mockOptionsRepository.save.mockResolvedValue(savedOption);
  
      const result = await service.create(dto);
  
      expect(mockOptionsRepository.manager.findOne).toHaveBeenCalledWith('ConceptualCategory', { where: { id: '1' } });
      expect(mockOptionsRepository.create).toHaveBeenCalledWith({
        name: 'Option1',
        conceptualCategory,
      });
      expect(mockOptionsRepository.save).toHaveBeenCalledWith(newOption);
      expect(result).toEqual(savedOption);
    });
  
    it('should throw a NotFoundException if conceptual category is not found', async () => {
      const dto: CreateOptionDto = { name: 'Option1', conceptualCategoryId: '1' };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(null);
  
      await expect(service.create(dto)).rejects.toThrow('ConceptualCategory with id 1 not found');
    });
  
    it('should throw a BadRequestException for null value in a column', async () => {
      const dto: CreateOptionDto = { name: 'Option1', conceptualCategoryId: '1' };
      const conceptualCategory = { id: '1', name: 'Category1' };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(conceptualCategory);
      mockOptionsRepository.save.mockRejectedValue({
        code: '23502',
        column: 'name',
      });
  
      await expect(service.create(dto)).rejects.toThrow(
        'Null value in column "name" violates not-null constraint',
      );
    });
  
    it('should throw a ConflictException for duplicate name', async () => {
      const dto: CreateOptionDto = { name: 'Option1', conceptualCategoryId: '1' };
      const conceptualCategory = { id: '1', name: 'Category1' };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(conceptualCategory);
      mockOptionsRepository.save.mockRejectedValue(
        new Error('duplicate key value violates unique constraint'),
      );
  
      await expect(service.create(dto)).rejects.toThrow(
        `Option with name ${dto.name} already exists`,
      );
    });
  
    it('should throw a BadRequestException for value too long', async () => {
      const dto: CreateOptionDto = { name: 'a'.repeat(256), conceptualCategoryId: '1' };
      const conceptualCategory = { id: '1', name: 'Category1' };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(conceptualCategory);
      mockOptionsRepository.save.mockRejectedValue(
        new Error('value too long for type character varying(255)'),
      );
  
      await expect(service.create(dto)).rejects.toThrow(
        'Value too long for type character varying(255)',
      );
    });
  
    it('should throw a generic BadRequestException for other errors', async () => {
      const dto: CreateOptionDto = { name: 'Option1', conceptualCategoryId: '1' };
      const conceptualCategory = { id: '1', name: 'Category1' };
  
      mockOptionsRepository.manager.findOne.mockResolvedValue(conceptualCategory);
      mockOptionsRepository.save.mockRejectedValue(
        new Error('Some other error'),
      );
  
      await expect(service.create(dto)).rejects.toThrow(
        'Error creating option: Some other error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all options', async () => {
      const options = [
        { id: '1', name: 'Option1', conceptualCategory: { id: '1', name: 'Category1' } },
        { id: '2', name: 'Option2', conceptualCategory: { id: '2', name: 'Category2' } },
      ];

      mockOptionsRepository.find.mockResolvedValue(options);

      const result = await service.findAll();

      expect(result).toEqual(options);
    });
  });

  describe('findById', () => {
    it('should return an option by ID', async () => {
      const option = { id: '1', name: 'Option1', conceptualCategory: { id: '1', name: 'Category1' } };

      mockOptionsRepository.findOne.mockResolvedValue(option);

      const result = await service.findById('1');

      expect(result).toEqual(option);
    });

    it('should throw an error if option is not found', async () => {
      mockOptionsRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('Option with id 1 not found');
    });
  });

  describe('update', () => {
    it('should update and return the option', async () => {
      const updatedOption = { id: '1', name: 'UpdatedOption', conceptualCategory: { id: '1', name: 'Category1' } };

      mockOptionsRepository.update.mockResolvedValue({ affected: 1 });
      mockOptionsRepository.findOne.mockResolvedValue(updatedOption);

      const result = await service.update('1', { name: 'UpdatedOption' });

      expect(mockOptionsRepository.update).toHaveBeenCalledWith('1', { name: 'UpdatedOption' });
      expect(result).toEqual(updatedOption);
    });

    it('should throw an error if option is not found', async () => {
      mockOptionsRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('1', { name: 'UpdatedOption' })).rejects.toThrow('Option with id 1 not found');
    });
  });

  describe('delete', () => {
    it('should delete an option and return it', async () => {
      const option = { id: '1', name: 'Option1', conceptualCategory: { id: '1', name: 'Category1' } };
  
      mockOptionsRepository.findOne.mockResolvedValue(option);
      mockOptionsRepository.delete.mockResolvedValue({ affected: 1 });
      mockOptionsRepository.find.mockResolvedValue([]);
  
      const result = await service.delete('1');
  
      expect(result).toEqual(option);
      expect(mockOptionsRepository.delete).toHaveBeenCalledWith('1');

    });
  
    it('should throw an error if option is not found', async () => {
      mockOptionsRepository.findOne.mockResolvedValue(null);
  
      await expect(service.delete('1')).rejects.toThrow('Option with id 1 not found');
    });
  });


});