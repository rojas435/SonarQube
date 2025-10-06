import { Test, TestingModule } from '@nestjs/testing';
import { CustomCandleController } from './custom-candle.controller';
import { CustomCandleService } from './custom-candle.service';
import { CreateCustomCandleDto } from './dto/create-custom-candle.dto';
import { UpdateCustomCandleDto } from './dto/update-custom-candle.dto';

describe('CustomCandleController', () => {
  let controller: CustomCandleController;
  let service: CustomCandleService;

  // Mock del servicio
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomCandleController],
      providers: [
        {
          provide: CustomCandleService,
          useValue: mockService, // Simulación del servicio
        },
      ],
    }).compile();

    controller = module.get<CustomCandleController>(CustomCandleController);
    service = module.get<CustomCandleService>(CustomCandleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created custom candle', async () => {
      const createDto: CreateCustomCandleDto = {
        containerId: 'uuid-container',
        fragranceId: 'uuid-fragrance',
        emotionalStateId: 'uuid-emotional-state',
        price: 25.5,
        quantity: 1,
      };
      const mockCandle = { id: 'uuid-candle', ...createDto };

      mockService.create.mockResolvedValue(mockCandle);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCandle);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if service.create fails', async () => {
      const createDto: CreateCustomCandleDto = {
        containerId: 'uuid-container',
        fragranceId: 'uuid-fragrance',
        emotionalStateId: 'uuid-emotional-state',
        price: 25.5,
        quantity: 1,
      };

      mockService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return all custom candles', async () => {
      const mockCandles = [
        { id: 'uuid-candle-1', name: 'Candle 1' },
        { id: 'uuid-candle-2', name: 'Candle 2' },
      ];

      mockService.findAll.mockResolvedValue(mockCandles);

      const result = await controller.findAll();

      expect(result).toEqual(mockCandles);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('should throw an error if service.findAll fails', async () => {
      mockService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return the custom candle', async () => {
      const mockCandle = { id: 'uuid-candle', name: 'Candle 1' };

      mockService.findOne.mockResolvedValue(mockCandle);

      const result = await controller.findOne('uuid-candle');

      expect(result).toEqual(mockCandle);
      expect(mockService.findOne).toHaveBeenCalledWith('uuid-candle');
    });

    it('should throw an error if service.findOne fails', async () => {
      mockService.findOne.mockRejectedValue(new Error('Candle not found'));

      await expect(controller.findOne('uuid-candle')).rejects.toThrow('Candle not found');
      expect(mockService.findOne).toHaveBeenCalledWith('uuid-candle');
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated custom candle', async () => {
      const updateDto: UpdateCustomCandleDto = { name: 'Updated Candle' };
      const mockCandle = { id: 'uuid-candle', ...updateDto };

      mockService.update.mockResolvedValue(mockCandle);

      const result = await controller.update('uuid-candle', updateDto);

      expect(result).toEqual(mockCandle);
      expect(mockService.update).toHaveBeenCalledWith('uuid-candle', updateDto);
    });

    it('should throw an error if service.update fails', async () => {
      const updateDto: UpdateCustomCandleDto = { name: 'Updated Candle' };

      mockService.update.mockRejectedValue(new Error('Service error'));

      await expect(controller.update('uuid-candle', updateDto)).rejects.toThrow('Service error');
      expect(mockService.update).toHaveBeenCalledWith('uuid-candle', updateDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return the removed custom candle', async () => {
      const mockCandle = { id: 'uuid-candle', name: 'Candle to Delete' };

      mockService.remove.mockResolvedValue(mockCandle);

      const result = await controller.remove('uuid-candle');

      expect(result).toEqual(mockCandle);
      expect(mockService.remove).toHaveBeenCalledWith('uuid-candle');
    });

    it('should throw an error if service.remove fails', async () => {
      mockService.remove.mockRejectedValue(new Error('Service error'));

      await expect(controller.remove('uuid-candle')).rejects.toThrow('Service error');
      expect(mockService.remove).toHaveBeenCalledWith('uuid-candle');
    });
  });
});