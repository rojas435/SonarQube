import { Test, TestingModule } from '@nestjs/testing';
import { EmotionalStateController } from './emotional-state.controller';
import { EmotionalStateService } from './emotional-state.service';
import { CreateEmotionalStateDto } from './dto/create-emotional-state.dto';
import { UpdateEmotionalStateDto } from './dto/update-emotional-state.dto';

describe('EmotionalStateController', () => {
  let controller: EmotionalStateController;
  let service: EmotionalStateService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionalStateController],
      providers: [
        {
          provide: EmotionalStateService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EmotionalStateController>(EmotionalStateController);
    service = module.get<EmotionalStateService>(EmotionalStateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateEmotionalStateDto = {
        name: 'Happy',
        description: 'A positive emotional state',
        optionId: 'uuid-option',
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
        { id: 'uuid', name: 'Happy', description: 'A positive emotional state' },
      ];

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Happy', description: 'A positive emotional state' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findById('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateEmotionalStateDto = { name: 'Excited' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'Happy', description: 'A positive emotional state' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});