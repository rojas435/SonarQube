import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateSubscriptionDto = {
        userId: 'uuid-user',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: 'active',
        renewalDate: new Date('2023-12-01'),
        plan: 'premium',
        price: 99.99,
        notes: 'Test subscription',
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllSubscriptions', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', user: {}, startDate: new Date(), status: 'active' },
      ];

      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.getAllSubscriptions();

      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('findBySubscriptionId', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', user: {}, startDate: new Date(), status: 'active' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.findBySubscriptionId('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateSubscriptionDto = { status: 'inactive' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      const result = await controller.update('uuid', dto);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', user: {}, startDate: new Date(), status: 'active' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete('uuid');

      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});