import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity'; // Ajusté la ruta para que apunte correctamente a la entidad Order
import { CustomCandle } from '../../../candles/custom-candle/entities/custom-candle.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => CustomCandle, { nullable: true })
  @JoinColumn({ name: 'custom_candle_id' })
  customCandle: CustomCandle;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;
}