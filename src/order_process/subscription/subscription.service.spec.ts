import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { NotFoundException } from '@nestjs/common';

const mockSubscriptionRepository = {
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

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: Repository<Subscription>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(Subscription),
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<Repository<Subscription>>(getRepositoryToken(Subscription));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new subscription', async () => {
      const createSubscriptionDto = {
        userId: 'user-id',
        startDate: new Date(),
        status: 'active',
        price: 100.0,
      };
      const existingUser = { id: 'user-id' };
      const newSubscription = { id: 'subscription-id', ...createSubscriptionDto };

      mockSubscriptionRepository.manager.findOne.mockResolvedValueOnce(existingUser); // For user
      mockSubscriptionRepository.create.mockReturnValue(newSubscription);
      mockSubscriptionRepository.save.mockResolvedValue(newSubscription);

      const result = await service.create(createSubscriptionDto);
      expect(result).toEqual(newSubscription);
      expect(mockSubscriptionRepository.manager.findOne).toHaveBeenCalledWith('User', { where: { id: 'user-id' } });
      expect(mockSubscriptionRepository.create).toHaveBeenCalledWith({
        ...createSubscriptionDto,
        user: existingUser,
      });
      expect(mockSubscriptionRepository.save).toHaveBeenCalledWith(newSubscription);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockSubscriptionRepository.manager.findOne.mockResolvedValueOnce(null); // For user

      await expect(
        service.create({
          userId: 'invalid-user-id',
          startDate: new Date(),
          status: 'active',
          price: 100.0,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return all subscriptions', async () => {
      const subscriptions = [{ id: 'subscription-id', status: 'active', price: 100.0 }];
      mockSubscriptionRepository.find.mockResolvedValue(subscriptions);

      const result = await service.getAll();
      expect(result).toEqual(subscriptions);
      expect(mockSubscriptionRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('findById', () => {
    it('should return a subscription by id', async () => {
      const subscription = { id: 'subscription-id', status: 'active', price: 100.0 };
      mockSubscriptionRepository.findOne.mockResolvedValue(subscription);

      const result = await service.findById('subscription-id');
      expect(result).toEqual(subscription);
      expect(mockSubscriptionRepository.findOne).toHaveBeenCalledWith({ where: { id: 'subscription-id' } });
    });

    it('should throw NotFoundException if subscription is not found', async () => {
      mockSubscriptionRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated subscription', async () => {
      const updateSubscriptionDto = { status: 'inactive', price: 50.0 };
      const updatedSubscription = { id: 'subscription-id', ...updateSubscriptionDto };

      mockSubscriptionRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findById').mockResolvedValue(updatedSubscription as any);

      const result = await service.update('subscription-id', updateSubscriptionDto as any);
      expect(result).toEqual(updatedSubscription);
      expect(mockSubscriptionRepository.update).toHaveBeenCalledWith('subscription-id', updateSubscriptionDto);
    });

    it('should throw NotFoundException if subscription is not found', async () => {
      mockSubscriptionRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('invalid-id', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted subscription', async () => {
      const subscription = { id: 'subscription-id', status: 'active', price: 100.0 };

      jest.spyOn(service, 'findById').mockResolvedValue(subscription as any);
      mockSubscriptionRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('subscription-id');
      expect(result).toEqual(subscription);
      expect(mockSubscriptionRepository.delete).toHaveBeenCalledWith('subscription-id');
    });

    it('should throw NotFoundException if subscription is not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());

      await expect(service.delete('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});