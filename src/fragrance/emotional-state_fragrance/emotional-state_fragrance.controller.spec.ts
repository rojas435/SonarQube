import { Test, TestingModule } from '@nestjs/testing';
import { EmotionalStateFragranceController } from './emotional-state_fragrance.controller';
import { EmotionalStateFragranceService } from './emotional-state_fragrance.service';
import { CreateEmotionalStateFragranceDto } from './dto/create-emotional-state_fragrance.dto';

describe('EmotionalStateFragranceController', () => {
  let controller: EmotionalStateFragranceController;
  let service: EmotionalStateFragranceService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmotionalStateAndFragranceId: jest.fn(),
    findByEmotionalStateId: jest.fn(),
    findByFragranceId: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionalStateFragranceController],
      providers: [
        {
          provide: EmotionalStateFragranceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EmotionalStateFragranceController>(EmotionalStateFragranceController);
    service = module.get<EmotionalStateFragranceService>(EmotionalStateFragranceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateEmotionalStateFragranceDto = {
        fragranceId: 'uuid-fragrance',
        emotionalStateId: 'uuid-emotional-state',
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
      const mockResult = [{ id: 'uuid', fragrance: {}, emotionalState: {} }];

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findByEmotionalStateAndFragranceId and return the result', async () => {
      const mockResult = { id: 'uuid', fragrance: {}, emotionalState: {} };

      mockService.findByEmotionalStateAndFragranceId.mockResolvedValue(mockResult);

      const result = await controller.findOne('uuid-emotional-state', 'uuid-fragrance');

      expect(result).toEqual(mockResult);
      expect(mockService.findByEmotionalStateAndFragranceId).toHaveBeenCalledWith('uuid-emotional-state', 'uuid-fragrance');
    });

    it('should return an EmotionalStateFragrance with relationships', async () => {
      const mockResult = {
        id: 'uuid',
        fragrance: { id: '1', name: 'Fragrance1' },
        emotionalState: { id: '2', name: 'Happy' },
      };
  
      mockService.findByEmotionalStateAndFragranceId.mockResolvedValue(mockResult);
  
      const result = await controller.findOne('uuid-emotional-state', 'uuid-fragrance');
  
      expect(result).toEqual(mockResult);
      expect(mockService.findByEmotionalStateAndFragranceId).toHaveBeenCalledWith('uuid-emotional-state', 'uuid-fragrance');
    });

    it('should return an EmotionalStateFragrance with relationships', async () => {
      const mockResult = {
        id: 'uuid',
        fragrance: { id: '1', name: 'Fragrance1' },
        emotionalState: { id: '2', name: 'Happy' },
      };
  
      mockService.findByEmotionalStateAndFragranceId.mockResolvedValue(mockResult);
  
      const result = await controller.findOne('uuid-emotional-state', 'uuid-fragrance');
  
      expect(result).toEqual(mockResult);
      expect(mockService.findByEmotionalStateAndFragranceId).toHaveBeenCalledWith('uuid-emotional-state', 'uuid-fragrance');
    });
  });

  describe('findByEmotionalStateId', () => {
    it('should call service.findByEmotionalStateId and return the result', async () => {
      const mockResult = [{ id: 'uuid', fragrance: {}, emotionalState: {} }];

      mockService.findByEmotionalStateId.mockResolvedValue(mockResult);

      const result = await controller.findByEmotionalStateId('uuid-emotional-state');

      expect(result).toEqual(mockResult);
      expect(mockService.findByEmotionalStateId).toHaveBeenCalledWith('uuid-emotional-state');
    });
  });

  describe('findByFragranceId', () => {
    it('should call service.findByFragranceId and return the result', async () => {
      const mockResult = [{ id: 'uuid', fragrance: {}, emotionalState: {} }];

      mockService.findByFragranceId.mockResolvedValue(mockResult);

      const result = await controller.findByFragranceId('uuid-fragrance');

      expect(result).toEqual(mockResult);
      expect(mockService.findByFragranceId).toHaveBeenCalledWith('uuid-fragrance');
    });
  });

  describe('remove', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', fragrance: {}, emotionalState: {} };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.remove('uuid-emotional-state', 'uuid-fragrance');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid-emotional-state', 'uuid-fragrance');
    });
  });
});