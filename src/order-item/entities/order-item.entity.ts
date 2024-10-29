// src/orders/entities/order-item.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from 'src/order/entities/order.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { AbstractEntity } from '@libs/database/entities/abstract.entity';

@Entity('order_items')
export class OrderItemEntity extends AbstractEntity {
    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => OrderEntity, (orderEntity) => orderEntity.orderItems, {
        onDelete: 'CASCADE',
    })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
        onDelete: 'CASCADE',
    })
    product: ProductEntity;
}