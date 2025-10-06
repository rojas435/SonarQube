import { Test, TestingModule } from '@nestjs/testing';
import { EmotionalStateService } from './emotional-state.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionalState } from './entities/emotional-state.entity';
import { CreateEmotionalStateDto } from './dto/create-emotional-state.dto';
import { UpdateEmotionalStateDto } from './dto/update-emotional-state.dto';

describe('EmotionalStateService', () => {
  let service: EmotionalStateService;

  const mockEmotionalStateRepository = {
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
        EmotionalStateService,
        {
          provide: getRepositoryToken(EmotionalState),
          useValue: mockEmotionalStateRepository,
        },
      ],
    }).compile();

    service = module.get<EmotionalStateService>(EmotionalStateService);

    Object.values(mockEmotionalStateRepository).forEach((fn) => {
      if (typeof fn === 'function' && fn.mockReset) {
        fn.mockReset();
      }
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new emotional state', async () => {
      const dto: CreateEmotionalStateDto = { name: 'Happy', optionId: '1', description: 'A positive emotional state' };
      const option = { id: '1', name: 'Option1' };
      const newState = { name: 'Happy', description: 'A positive emotional state', option };
      const savedState = { id: '1', ...newState };
    
      mockEmotionalStateRepository.manager.findOne.mockResolvedValue(option);
      mockEmotionalStateRepository.create.mockReturnValue(newState);
      mockEmotionalStateRepository.save.mockResolvedValue(savedState);
    
      const result = await service.create(dto);
    
      expect(mockEmotionalStateRepository.manager.findOne).toHaveBeenCalledWith('Option', { where: { id: '1' } });
      expect(mockEmotionalStateRepository.create).toHaveBeenCalledWith({
        name: 'Happy',
        description: 'A positive emotional state',
        option,
      });
      expect(mockEmotionalStateRepository.save).toHaveBeenCalledWith(newState);
      expect(result).toEqual(savedState);
    });

    it('should throw an error if option is not found', async () => {
      const dto: CreateEmotionalStateDto = { name: 'Happy', optionId: '1', description: 'A positive emotional state' };

      mockEmotionalStateRepository.manager.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow('Option with id 1 not found');
    });
  });

  describe('findAll', () => {
    it('should return all emotional states', async () => {
      const states = [
        { id: '1', name: 'Happy', option: { id: '1', name: 'Option1' } },
        { id: '2', name: 'Sad', option: { id: '2', name: 'Option2' } },
      ];

      mockEmotionalStateRepository.find.mockResolvedValue(states);

      const result = await service.findAll();

      expect(result).toEqual(states);
    });
  });

  describe('findById', () => {
    it('should return an emotional state by ID', async () => {
      const state = { id: '1', name: 'Happy', option: { id: '1', name: 'Option1' } };

      mockEmotionalStateRepository.findOne.mockResolvedValue(state);

      const result = await service.findById('1');

      expect(result).toEqual(state);
    });

    it('should throw an error if emotional state is not found', async () => {
      mockEmotionalStateRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('EmotionalState with id 1 not found');
    });
  });

  describe('update', () => {
    it('should update and return the emotional state', async () => {
      const updatedState = { id: '1', name: 'Excited', option: { id: '1', name: 'Option1' } };

      mockEmotionalStateRepository.update.mockResolvedValue({ affected: 1 });
      mockEmotionalStateRepository.findOne.mockResolvedValue(updatedState);

      const result = await service.update('1', { name: 'Excited' });

      expect(mockEmotionalStateRepository.update).toHaveBeenCalledWith('1', { name: 'Excited' });
      expect(result).toEqual(updatedState);
    });

    it('should throw an error if emotional state is not found', async () => {
      mockEmotionalStateRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('1', { name: 'Excited' })).rejects.toThrow('EmotionalState with id 1 not found');
    });
  });

  describe('delete', () => {
    it('should delete an emotional state and return it', async () => {
      const state = { id: '1', name: 'Happy', option: { id: '1', name: 'Option1' } };

      mockEmotionalStateRepository.findOne.mockResolvedValue(state);
      mockEmotionalStateRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');

      expect(result).toEqual(state);
      expect(mockEmotionalStateRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if emotional state is not found', async () => {
      mockEmotionalStateRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow('EmotionalState with id 1 not found');
    });
  });
});