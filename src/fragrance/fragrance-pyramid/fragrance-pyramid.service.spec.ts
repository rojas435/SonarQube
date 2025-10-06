import { Test, TestingModule } from '@nestjs/testing';
import { FragrancePyramidService } from './fragrance-pyramid.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FragrancePyramid } from './entities/fragrance-pyramid.entity';
import { CreateFragrancePyramidDto } from './dto/create-fragrance-pyramid.dto';
import { UpdateFragrancePyramidDto } from './dto/update-fragrance-pyramid.dto';

describe('FragrancePyramidService', () => {
  let service: FragrancePyramidService;

  const mockFragrancePyramidRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
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
        FragrancePyramidService,
        {
          provide: getRepositoryToken(FragrancePyramid),
          useValue: mockFragrancePyramidRepository,
        },
      ],
    }).compile();

    service = module.get<FragrancePyramidService>(FragrancePyramidService);

    Object.values(mockFragrancePyramidRepository).forEach((fn) => {
      if (typeof fn === 'function' && fn.mockReset) {
        fn.mockReset();
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new fragrance pyramid', async () => {
      const dto: CreateFragrancePyramidDto = {
        fragranceId: '1',
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
      };
      const fragrance = { id: '1', name: 'Fragrance1' };
      const newFragrancePyramid = {
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
        fragrance,
      };
      const savedFragrancePyramid = { id: '1', ...newFragrancePyramid };

      mockFragrancePyramidRepository.manager.findOne.mockResolvedValue(fragrance);
      mockFragrancePyramidRepository.create.mockReturnValue(newFragrancePyramid);
      mockFragrancePyramidRepository.save.mockResolvedValue(savedFragrancePyramid);

      const result = await service.create(dto);

      expect(mockFragrancePyramidRepository.manager.findOne).toHaveBeenCalledWith('Fragrance', { where: { id: '1' } });
      expect(mockFragrancePyramidRepository.create).toHaveBeenCalledWith({
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
        fragrance,
      });
      expect(mockFragrancePyramidRepository.save).toHaveBeenCalledWith(newFragrancePyramid);
      expect(result).toEqual(savedFragrancePyramid);
    });

    it('should throw an error if fragrance is not found', async () => {
      const dto: CreateFragrancePyramidDto = {
        fragranceId: '1',
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
      };

      mockFragrancePyramidRepository.manager.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow('Fragrance with id 1 not found');
    });
  });

  describe('getAll', () => {
    it('should return all fragrance pyramids', async () => {
      const pyramids = [
        { id: '1', top: 'Citrus', heart: 'Floral', base: 'Woody', fragrance: { id: '1', name: 'Fragrance1' } },
        { id: '2', top: 'Fruity', heart: 'Spicy', base: 'Amber', fragrance: { id: '2', name: 'Fragrance2' } },
      ];

      mockFragrancePyramidRepository.find.mockResolvedValue(pyramids);

      const result = await service.getAll();

      expect(result).toEqual(pyramids);
    });
  });

  describe('findById', () => {
    it('should return a fragrance pyramid by ID', async () => {
      const pyramid = {
        id: '1',
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
        fragrance: { id: '1', name: 'Fragrance1' },
      };

      mockFragrancePyramidRepository.findOneBy.mockResolvedValue(pyramid);

      const result = await service.findById('1');

      expect(result).toEqual(pyramid);
    });

    it('should throw an error if fragrance pyramid is not found', async () => {
      mockFragrancePyramidRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('FragrancePyramid with id 1 not found');
    });
  });

  describe('update', () => {
    it('should update and return the fragrance pyramid', async () => {
      const updatedPyramid = {
        id: '1',
        top: 'Updated Citrus',
        heart: 'Updated Floral',
        base: 'Updated Woody',
        fragrance: { id: '1', name: 'Fragrance1' },
      };

      mockFragrancePyramidRepository.update.mockResolvedValue({ affected: 1 });
      mockFragrancePyramidRepository.findOneBy.mockResolvedValue(updatedPyramid);

      const result = await service.update('1', {
        top: 'Updated Citrus',
        heart: 'Updated Floral',
        base: 'Updated Woody',
      });

      expect(mockFragrancePyramidRepository.update).toHaveBeenCalledWith('1', {
        top: 'Updated Citrus',
        heart: 'Updated Floral',
        base: 'Updated Woody',
      });
      expect(result).toEqual(updatedPyramid);
    });

    it('should throw an error if fragrance pyramid is not found', async () => {
      mockFragrancePyramidRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.update('1', { top: 'Updated Citrus', heart: 'Updated Floral', base: 'Updated Woody' }),
      ).rejects.toThrow('FragrancePyramid with id 1 not found');
    });
  });

  describe('delete', () => {
    it('should delete a fragrance pyramid and return it', async () => {
      const pyramid = {
        id: '1',
        top: 'Citrus',
        heart: 'Floral',
        base: 'Woody',
        fragrance: { id: '1', name: 'Fragrance1' },
      };

      mockFragrancePyramidRepository.findOneBy.mockResolvedValue(pyramid);
      mockFragrancePyramidRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');

      expect(result).toEqual(pyramid);
      expect(mockFragrancePyramidRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if fragrance pyramid is not found', async () => {
      mockFragrancePyramidRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow('FragrancePyramid with id 1 not found');
    });
  });
});