import { AbstractEntity } from "@libs/database/entities/abstract.entity";
import { OrderItemEntity } from "../../order-item/entities/order-item.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('products')
export class ProductEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => OrderItemEntity, (orderItemEntity) => orderItemEntity.product, {
        cascade: true,
    })
    orderItems: OrderItemEntity[];
}