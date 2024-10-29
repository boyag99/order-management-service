import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderItemEntity])
    ]
})
export class OrderItemModule {}
