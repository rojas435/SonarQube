import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(@InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>) {}

  async create(orderItem: CreateOrderItemDto) {

    const existingOrder = await this.orderItemRepository.manager.findOne('Order', { where: { id: orderItem.orderId } });
    if (!existingOrder) {
      throw new NotFoundException(`Order with id ${orderItem.orderId} does not exist`);
    }

    const existingCustomCandle = await this.orderItemRepository.manager.findOne('CustomCandle', { where: { id: orderItem.customCandleId } });
    if (!existingCustomCandle) {
      throw new NotFoundException(`CustomCandle with id ${orderItem.customCandleId} does not exist`);
    }

    const newOrderItem = this.orderItemRepository.create({
      ...orderItem,
      order: existingOrder,
      customCandle: existingCustomCandle,
    });
    
    return this.orderItemRepository.save(newOrderItem);
  }

  getAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order', 'customCandle'] });
  }

  async findById(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['order', 'customCandle'] });
    if (orderItem == null) throw new NotFoundException(`OrderItem with id ${id} not found`);

    return orderItem;
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItems = await this.orderItemRepository.find({
      where: { order: { id: orderId } },
      relations: ['order', 'customCandle'],
    });

    if (orderItems.length === 0) {
      throw new NotFoundException(`No OrderItems found for Order with id ${orderId}`);
    }

    return orderItems;
  }

  async update(id: string, updateOrderItem: UpdateOrderItemDto): Promise<OrderItem> {
    const result = await this.orderItemRepository.update(id, updateOrderItem);
    if (result.affected && result.affected < 1) throw new NotFoundException(`OrderItem with id ${id} not found`);
    return this.findById(id);
  }

  delete(id: string): Promise<OrderItem> {
    const deleteOrderItem = this.findById(id);
    this.orderItemRepository.delete(id);
    if (deleteOrderItem == null) throw new NotFoundException(`OrderItem with id ${id} not found`);
    return deleteOrderItem;
  }


}
