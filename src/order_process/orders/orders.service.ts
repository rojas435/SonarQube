import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  async create(order: CreateOrderDto) {
    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(`Null value in column "${error.column}" violates not-null constraint`);
      } else if (error.message.includes('value too long for type character varying(255)')) {
        throw new BadRequestException(`Value too long for type character varying(255)`);
      }

      throw new BadRequestException(`Error creating order: ${error.message}`);
    }
  }

  getAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.customCandle'] });
  }
  
  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.customCandle'],
    });
    if (order == null) throw new NotFoundException(`Order with id ${id} not found`);
  
    return order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.customCandle'],
    });

    if (orders.length === 0) {
      throw new NotFoundException(`No orders found for user with id ${userId}`);
    }

    return orders;
  }

  async update(id: string, updateOrder: UpdateOrderDto): Promise<Order> {
    const result = await this.orderRepository.update(id, updateOrder);
    if (result.affected && result.affected < 1) throw new NotFoundException(`Order with id ${id} not found`);
    return this.findById(id);
  }

  delete(id: string): Promise<Order> {
    const deleteOrder = this.findById(id);
    this.orderRepository.delete(id);
    if (deleteOrder == null) throw new NotFoundException(`Order with id ${id} not found`);
    return deleteOrder;
  }
}
