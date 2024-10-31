import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderMapper } from './order.mapper';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity])
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderMapper],
})
export class OrderModule {}
