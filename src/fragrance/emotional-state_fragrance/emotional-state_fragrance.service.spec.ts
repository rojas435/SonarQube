import { Test, TestingModule } from '@nestjs/testing';
import { EmotionalStateFragranceService } from './emotional-state_fragrance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionalStateFragrance } from './entities/emotional-state_fragrance.entity';
import { CreateEmotionalStateFragranceDto } from './dto/create-emotional-state_fragrance.dto';

describe('EmotionalStateFragranceService', () => {
  let service: EmotionalStateFragranceService;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    manager: {
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmotionalStateFragranceService,
        {
          provide: getRepositoryToken(EmotionalStateFragrance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmotionalStateFragranceService>(EmotionalStateFragranceService);

    Object.values(mockRepository).forEach((fn) => {
      if (typeof fn === 'function' && fn.mockReset) {
        fn.mockReset();
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new EmotionalStateFragrance', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: '1',
        emotionalStateId: '2',
      };
      const fragrance = { id: '1', name: 'Fragrance1' };
      const emotionalState = { id: '2', name: 'Happy' };
      const newEntity = { fragrance, emotionalState };
      const savedEntity = { id: '3', ...newEntity };

      mockRepository.manager.findOne
        .mockResolvedValueOnce(fragrance) // First call for fragrance
        .mockResolvedValueOnce(emotionalState); // Second call for emotionalState
      mockRepository.create.mockReturnValue(newEntity);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(dto);

      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('Fragrance', { where: { id: '1' } });
      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('EmotionalState', { where: { id: '2' } });
      expect(mockRepository.create).toHaveBeenCalledWith({
        fragrance,
        emotionalState,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newEntity);
      expect(result).toEqual(savedEntity);
    });

    it('should throw an error if fragrance is not found', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: '1',
        emotionalStateId: '2',
      };

      mockRepository.manager.findOne.mockResolvedValueOnce(null); // Fragrance not found

      await expect(service.create(dto)).rejects.toThrow('Fragrance with id 1 not found');
    });

    it('should throw an error if emotional state is not found', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: '1',
        emotionalStateId: '2',
      };

      mockRepository.manager.findOne
        .mockResolvedValueOnce({ id: '1', name: 'Fragrance1' }) // Fragrance found
        .mockResolvedValueOnce(null); // EmotionalState not found

      await expect(service.create(dto)).rejects.toThrow('EmotionalState with id 2 not found');
    });

    it('should create and return a new EmotionalStateFragrance with relationships', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: '1',
        emotionalStateId: '2',
      };
      const fragrance = { id: '1', name: 'Fragrance1' };
      const emotionalState = { id: '2', name: 'Happy' };
      const newEntity = { fragrance, emotionalState };
      const savedEntity = { id: '3', ...newEntity };
  
      mockRepository.manager.findOne
        .mockResolvedValueOnce(fragrance) // First call for fragrance
        .mockResolvedValueOnce(emotionalState); // Second call for emotionalState
      mockRepository.create.mockReturnValue(newEntity);
      mockRepository.save.mockResolvedValue(savedEntity);
  
      const result = await service.create(dto);
  
      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('Fragrance', { where: { id: '1' } });
      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('EmotionalState', { where: { id: '2' } });
      expect(mockRepository.create).toHaveBeenCalledWith({
        fragrance,
        emotionalState,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newEntity);
      expect(result).toEqual(savedEntity);
    });

    it('should create and return a new EmotionalStateFragrance with relationships', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: '1',
        emotionalStateId: '2',
      };
      const fragrance = { id: '1', name: 'Fragrance1' };
      const emotionalState = { id: '2', name: 'Happy' };
      const newEntity = { fragrance, emotionalState };
      const savedEntity = { id: '3', ...newEntity };
  
      mockRepository.manager.findOne
        .mockResolvedValueOnce(fragrance) // First call for fragrance
        .mockResolvedValueOnce(emotionalState); // Second call for emotionalState
      mockRepository.create.mockReturnValue(newEntity);
      mockRepository.save.mockResolvedValue(savedEntity);
  
      const result = await service.create(dto);
  
      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('Fragrance', { where: { id: '1' } });
      expect(mockRepository.manager.findOne).toHaveBeenCalledWith('EmotionalState', { where: { id: '2' } });
      expect(mockRepository.create).toHaveBeenCalledWith({
        fragrance,
        emotionalState,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newEntity);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('findAll', () => {
    it('should return all EmotionalStateFragrance entities', async () => {
      const entities = [
        { id: '1', fragrance: { id: '1', name: 'Fragrance1' }, emotionalState: { id: '2', name: 'Happy' } },
        { id: '2', fragrance: { id: '3', name: 'Fragrance2' }, emotionalState: { id: '4', name: 'Calm' } },
      ];

      mockRepository.find.mockResolvedValue(entities);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['fragrance', 'emotionalState'] });
      expect(result).toEqual(entities);
    });
  });

  describe('findByEmotionalStateId', () => {
    it('should return an EmotionalStateFragrance by emotionalStateId', async () => {
      const entity = {
        id: '1',
        fragrance: { id: '1', name: 'Fragrance1' },
        emotionalState: { id: '2', name: 'Happy' },
      };

      mockRepository.findOne.mockResolvedValue(entity);

      const result = await service.findByEmotionalStateId('2');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '2' },
        relations: ['fragrance', 'emotionalState'],
      });
      expect(result).toEqual(entity);
    });

    it('should throw an error if EmotionalStateFragrance is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmotionalStateId('2')).rejects.toThrow(
        'EmotionalStateFragrance with id 2 not found',
      );
    });

    it('should return an EmotionalStateFragrance with relationships', async () => {
      const mockEntity = {
        id: 'uuid',
        fragrance: { id: '1', name: 'Fragrance1' },
        emotionalState: { id: '2', name: 'Happy' },
      };
  
      mockRepository.findOne.mockResolvedValue(mockEntity);
  
      const result = await service.findByEmotionalStateAndFragranceId('2', '1');
  
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          emotionalState: { id: '2' },
          fragrance: { id: '1' },
        },
        relations: ['fragrance', 'emotionalState'], // Verifica que las relaciones se carguen
      });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('delete', () => {
    it('should delete an EmotionalStateFragrance and return it', async () => {
      const entity = {
        id: '1',
        fragrance: { id: '1', name: 'Fragrance1' },
        emotionalState: { id: '2', name: 'Happy' },
      };

      mockRepository.findOne.mockResolvedValue(entity);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('2', '1');

      expect(result).toEqual(entity);
      expect(mockRepository.delete).toHaveBeenCalledWith({
        emotionalState: { id: '2' },
        fragrance: { id: '1' },
      });
    });

    it('should throw an error if EmotionalStateFragrance is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('2', '1')).rejects.toThrow(
        'EmotionalStateFragrance with emotionalStateId 2 and fragranceId 1 not found',
      );
    });
  });
});
