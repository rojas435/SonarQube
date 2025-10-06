import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: OrderItemService;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateOrderItemDto = {
        orderId: 'uuid-order',
        customCandleId: 'uuid-candle',
        quantity: 2,
        subtotal: 50.0,
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllOrderItems', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', order: {}, customCandle: {}, quantity: 2, subtotal: 50.0 },
      ];

      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAllOrderItems();

      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('getByOrderItemId', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', order: {}, customCandle: {}, quantity: 2, subtotal: 50.0 };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.getByOrderItemId('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateOrderItemDto = { quantity: 3, subtotal: 75.0 };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', order: {}, customCandle: {}, quantity: 2, subtotal: 50.0 };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});