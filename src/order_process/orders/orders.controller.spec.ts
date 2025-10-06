import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateOrderDto = {
        totalAmount: 100.0,
        status: 'pending',
        shippingAddress: '123 Main St',
        paymentMethod: 'credit card',
        notes: 'Deliver ASAP',
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllOrders', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', totalAmount: 100.0, status: 'pending' },
      ];

      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAllOrders();

      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', totalAmount: 100.0, status: 'pending' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findOne('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateOrderDto = { status: 'completed' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', totalAmount: 100.0, status: 'pending' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});