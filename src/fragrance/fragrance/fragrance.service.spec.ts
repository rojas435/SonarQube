import { Test, TestingModule } from '@nestjs/testing';
import { FragranceService } from './fragrance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fragrance } from './entities/fragrance.entity';
import { CreateFragranceDto } from './dto/create-fragrance.dto';

describe('FragranceService', () => {
  let service: FragranceService;

  const mockFragranceRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FragranceService,
        {
          provide: getRepositoryToken(Fragrance),
          useValue: mockFragranceRepository,
        },
      ],
    }).compile();

    service = module.get<FragranceService>(FragranceService);

    // Reset mocks before each test
    Object.values(mockFragranceRepository).forEach((fn) => fn.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save and return the fragrance', async () => {
      const dto: CreateFragranceDto = { name: 'Rose' };
      const saved = { id: '1', ...dto };

      mockFragranceRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(mockFragranceRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(saved);
    });

    it('should throw an error if name is not a string', async () => {
      const dto: CreateFragranceDto = { name: 123 as unknown as string };
  
      mockFragranceRepository.save.mockRejectedValue(new Error('invalid input syntax for type'));
  
      await expect(service.create(dto)).rejects.toThrow('invalid input syntax');
    });
  
    it('should throw an error if name is empty', async () => {
      const dto: CreateFragranceDto = { name: '' };
  
      // DB constraint might not trigger here, but you simulate validation error or rejection
      mockFragranceRepository.save.mockRejectedValue(new Error('null value in column "name"'));
  
      await expect(service.create(dto)).rejects.toThrow('null value');
    });
  
    it('should throw an error if name is too long', async () => {
      const dto: CreateFragranceDto = { name: 'a'.repeat(256) }; 
  
      mockFragranceRepository.save.mockRejectedValue(new Error('value too long for type character varying(255)'));
  
      await expect(service.create(dto)).rejects.toThrow('Value too long for type character varying(255)');
    });
  
    it('should throw an error if name is not unique', async () => {
      const dto: CreateFragranceDto = { name: 'Rose' };
  
      // Simulate duplicate key error from DB
      mockFragranceRepository.save.mockRejectedValue(
        new Error('duplicate key value violates unique constraint "fragrance_name_key"'),
      );
  
      await expect(service.create(dto)).rejects.toThrow(`Fragrance with name ${dto.name} already exists`);
    });

  });

  describe('findAll', () => {
    it('should return all fragrances', async () => {
      const data = [
        { id: '1', name: 'Rose', emotionalStateFragrance: [], fragrancePyramid: [] },
        { id: '2', name: 'Lavender', emotionalStateFragrance: [], fragrancePyramid: [] },
      ];

      mockFragranceRepository.find.mockResolvedValue(data);

      const result = await service.getAll();

      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return one fragrance by ID', async () => {
      const fragrance = { id: '1', name: 'Rose', emotionalStateFragrance: [], fragrancePyramid: [] };
  
      mockFragranceRepository.findOneBy.mockResolvedValue(fragrance);
  
      const result = await service.findById('1');
  
      expect(result).toEqual(fragrance);
    });

    it('should throw an error if fragrance not found', async () => {
      mockFragranceRepository.findOneBy.mockResolvedValue(null);
  
      await expect(service.findById('1')).rejects.toThrow('Fragrance with id 1 not found');
    });

  });
  

  describe('update', () => {
    it('should update and return the fragrance', async () => {
      const originalFragrance = {
        id: '1',
        name: 'Old Rose',
        emotionalStateFragrance: [],
        fragrancePyramid: [],
      };

      const updatedFragrance = {
        ...originalFragrance,
        name: 'New Rose', 
      };

      mockFragranceRepository.update.mockResolvedValue({ affected: 1 });
      mockFragranceRepository.findOneBy.mockResolvedValue(updatedFragrance);

      const result = await service.update('1', { name: 'New Rose' });

      expect(mockFragranceRepository.update).toHaveBeenCalledWith('1', { name: 'New Rose' });
      expect(result).toEqual(updatedFragrance);
    });

    it('should throw an error if fragrance not found', async () => {
      mockFragranceRepository.update.mockResolvedValue({ affected: 0 });
  
      await expect(service.update('1', { name: 'New Rose' })).rejects.toThrow('Fragrance with id 1 not found');
    });
  });

  describe('delete', () => {
    it('should delete a fragrance and return result', async () => {
      const fragrance = { id: '1', name: 'Rose', emotionalStateFragrance: [], fragrancePyramid: [] };
  
      mockFragranceRepository.findOneBy.mockResolvedValue(fragrance);
      mockFragranceRepository.delete.mockResolvedValue({ affected: 1 });
  
      const result = await service.delete('1');
  
      expect(result).toEqual(fragrance);
      expect(mockFragranceRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if fragrance not found', async () => {
      mockFragranceRepository.findOneBy.mockResolvedValue(null);
  
      await expect(service.delete('1')).rejects.toThrow('Fragrance with id 1 not found');
    });
  });
  
});
