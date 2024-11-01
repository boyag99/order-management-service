import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@libs/database/entities/abstract.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItemEntity } from '../../order-item/entities/order-item.entity';

@Entity('orders')
export class OrderEntity extends AbstractEntity {

  @Column('bigint')
  customerId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('text', { nullable: true })
  shippingAddress: string;

  @OneToMany(() => OrderItemEntity, (orderItemEntity) => orderItemEntity.order, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];
}