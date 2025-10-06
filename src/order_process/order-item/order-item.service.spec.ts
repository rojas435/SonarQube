import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { NotFoundException } from '@nestjs/common';

const mockOrderItemRepository = {
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

describe('OrderItemService', () => {
  let service: OrderItemService;
  let repository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    repository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new order item', async () => {
      const createOrderItemDto = {
        orderId: 'order-id',
        customCandleId: 'candle-id',
        quantity: 2,
        subtotal: 50.0,
      };
      const existingOrder = { id: 'order-id' };
      const existingCustomCandle = { id: 'candle-id' };
      const newOrderItem = { id: 'item-id', ...createOrderItemDto };

      mockOrderItemRepository.manager.findOne
        .mockResolvedValueOnce(existingOrder) // For order
        .mockResolvedValueOnce(existingCustomCandle); // For custom candle
      mockOrderItemRepository.create.mockReturnValue(newOrderItem);
      mockOrderItemRepository.save.mockResolvedValue(newOrderItem);

      const result = await service.create(createOrderItemDto);
      expect(result).toEqual(newOrderItem);
      expect(mockOrderItemRepository.manager.findOne).toHaveBeenCalledWith('Order', { where: { id: 'order-id' } });
      expect(mockOrderItemRepository.manager.findOne).toHaveBeenCalledWith('CustomCandle', { where: { id: 'candle-id' } });
      expect(mockOrderItemRepository.create).toHaveBeenCalledWith({
        ...createOrderItemDto,
        order: existingOrder,
        customCandle: existingCustomCandle,
      });
      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(newOrderItem);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      mockOrderItemRepository.manager.findOne.mockResolvedValueOnce(null); // For order

      await expect(
        service.create({
          orderId: 'invalid-order-id',
          customCandleId: 'candle-id',
          quantity: 2,
          subtotal: 50.0,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if custom candle does not exist', async () => {
      mockOrderItemRepository.manager.findOne
        .mockResolvedValueOnce({ id: 'order-id' }) // For order
        .mockResolvedValueOnce(null); // For custom candle

      await expect(
        service.create({
          orderId: 'order-id',
          customCandleId: 'invalid-candle-id',
          quantity: 2,
          subtotal: 50.0,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return all order items', async () => {
      const orderItems = [{ id: 'item-id', quantity: 2, subtotal: 50.0 }];
      mockOrderItemRepository.find.mockResolvedValue(orderItems);

      const result = await service.getAll();
      expect(result).toEqual(orderItems);
      expect(mockOrderItemRepository.find).toHaveBeenCalledWith({ relations: ['order', 'customCandle'] });
    });
  });

  describe('findById', () => {
    it('should return an order item by id', async () => {
      const orderItem = { id: 'item-id', quantity: 2, subtotal: 50.0 };
      mockOrderItemRepository.findOne.mockResolvedValue(orderItem);

      const result = await service.findById('item-id');
      expect(result).toEqual(orderItem);
      expect(mockOrderItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'item-id' },
        relations: ['order', 'customCandle'],
      });
    });

    it('should throw NotFoundException if order item is not found', async () => {
      mockOrderItemRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated order item', async () => {
      const updateOrderItemDto = { quantity: 3, subtotal: 75.0 };
      const updatedOrderItem = { id: 'item-id', ...updateOrderItemDto };

      mockOrderItemRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findById').mockResolvedValue(updatedOrderItem as any);

      const result = await service.update('item-id', updateOrderItemDto as any);
      expect(result).toEqual(updatedOrderItem);
      expect(mockOrderItemRepository.update).toHaveBeenCalledWith('item-id', updateOrderItemDto);
    });

    it('should throw NotFoundException if order item is not found', async () => {
      mockOrderItemRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('invalid-id', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted order item', async () => {
      const orderItem = { id: 'item-id', quantity: 2, subtotal: 50.0 };

      jest.spyOn(service, 'findById').mockResolvedValue(orderItem as any);
      mockOrderItemRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('item-id');
      expect(result).toEqual(orderItem);
      expect(mockOrderItemRepository.delete).toHaveBeenCalledWith('item-id');
    });

    it('should throw NotFoundException if order item is not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());

      await expect(service.delete('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});