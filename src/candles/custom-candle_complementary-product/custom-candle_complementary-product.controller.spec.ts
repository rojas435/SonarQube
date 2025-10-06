import { Test, TestingModule } from '@nestjs/testing';
import { CustomCandleComplementaryProductController } from './custom-candle_complementary-product.controller';
import { CustomCandleComplementaryProductService } from './custom-candle_complementary-product.service';
import { NotFoundException } from '@nestjs/common';

describe('CustomCandleComplementaryProductController', () => {
  let controller: CustomCandleComplementaryProductController;
  let service: CustomCandleComplementaryProductService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomCandleComplementaryProductController],
      providers: [
        {
          provide: CustomCandleComplementaryProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CustomCandleComplementaryProductController>(CustomCandleComplementaryProductController);
    service = module.get<CustomCandleComplementaryProductService>(CustomCandleComplementaryProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new CustomCandleComplementaryProduct', async () => {
      const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };
      const mockResult = { id: 1, ...createDto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if CustomCandle is not found', async () => {
      const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };

      mockService.create.mockRejectedValue(new NotFoundException('CustomCandle with id uuid-candle not found'));

      await expect(controller.create(createDto)).rejects.toThrow('CustomCandle with id uuid-candle not found');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all CustomCandleComplementaryProducts', async () => {
      const mockResult = [
        { id: 1, customCandleId: 'uuid-candle', complementaryProductId: 1 },
        { id: 2, customCandleId: 'uuid-candle-2', complementaryProductId: 2 },
      ];

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a CustomCandleComplementaryProduct by ID', async () => {
      const mockResult = { id: 1, customCandleId: 'uuid-candle', complementaryProductId: 1 };

      mockService.findOne.mockResolvedValue(mockResult);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if CustomCandleComplementaryProduct is not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('CustomCandleComplementaryProduct with id 1 not found'));

      await expect(controller.findOne(1)).rejects.toThrow('CustomCandleComplementaryProduct with id 1 not found');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a CustomCandleComplementaryProduct', async () => {
      const mockResult = { id: 1 };

      mockService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(1);

      expect(result).toEqual(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if CustomCandleComplementaryProduct to remove is not found', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException('CustomCandleComplementaryProduct with id 1 not found'));

      await expect(controller.remove(1)).rejects.toThrow('CustomCandleComplementaryProduct with id 1 not found');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});