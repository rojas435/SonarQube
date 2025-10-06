import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(@InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>) {}

  async create(subscription: CreateSubscriptionDto) {
    const existingUser = await this.subscriptionRepository.manager.findOne('User', { where: { id: subscription.userId } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${subscription.userId} does not exist`);
    }

    const newSubscription = this.subscriptionRepository.create({
      ...subscription,
      user: existingUser,
    });

    return this.subscriptionRepository.save(newSubscription);
  }

  getAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find();
  }

  async findById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id }});
    if (subscription == null) throw new NotFoundException(`Subscription with id ${id} not found`);

    return subscription;
  }

  async update(id: string, updateSubscription: UpdateSubscriptionDto): Promise<Subscription> {
    const result = await this.subscriptionRepository.update(id, updateSubscription);
    if (result.affected && result.affected < 1) throw new NotFoundException(`Subscription with id ${id} not found`);
    return this.findById(id);
  }

  delete(id: string): Promise<Subscription> {
    const deleteSubscription = this.findById(id);
    this.subscriptionRepository.delete(id);
    if (deleteSubscription == null) throw new NotFoundException(`Subscription with id ${id} not found`);
    return deleteSubscription;
  }
}
