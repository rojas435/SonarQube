import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockOrderRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new order', async () => {
      const createOrderDto = { totalAmount: 100, status: 'pending' };
      const savedOrder = { id: '1', ...createOrderDto };

      mockOrderRepository.save.mockResolvedValue(savedOrder);

      const result = await service.create(createOrderDto as any);
      expect(result).toEqual(savedOrder);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw BadRequestException on save error', async () => {
      mockOrderRepository.save.mockRejectedValue(new Error('Save error'));

      await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAll', () => {
    it('should return all orders', async () => {
      const orders = [{ id: '1', totalAmount: 100 }];
      mockOrderRepository.find.mockResolvedValue(orders);

      const result = await service.getAll();
      expect(result).toEqual(orders);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({ relations: ['items', 'items.customCandle'] });
    });
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      const order = { id: '1', totalAmount: 100 };
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.findById('1');
      expect(result).toEqual(order);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['items', 'items.customCandle'],
      });
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated order', async () => {
      const updateOrderDto = { totalAmount: 200 };
      const updatedOrder = { id: '1', ...updateOrderDto };

      mockOrderRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findById').mockResolvedValue(updatedOrder as any);

      const result = await service.update('1', updateOrderDto as any);
      expect(result).toEqual(updatedOrder);
      expect(mockOrderRepository.update).toHaveBeenCalledWith('1', updateOrderDto);
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockOrderRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted order', async () => {
      const order = { id: '1', totalAmount: 100 };

      jest.spyOn(service, 'findById').mockResolvedValue(order as any);
      mockOrderRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');
      expect(result).toEqual(order);
      expect(mockOrderRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});