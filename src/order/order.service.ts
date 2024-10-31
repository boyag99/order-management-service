import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from 'src/order-item/entities/order-item.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { OrderDto } from './dtos/order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import _ from 'lodash';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly dataSource: DataSource,
        @InjectMapper() private readonly mapper: Mapper,
    ) { }

    async getOrder(id: number): Promise<OrderDto> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['orderItems']
        });

        return this.mapper.mapAsync(order, OrderEntity, OrderDto)
    }

    async getOrders(): Promise<OrderDto[]> {
        const orders = await this.orderRepository.find({
            relations: ['orderItems']
        });

        return this.mapper.mapArrayAsync(orders, OrderEntity, OrderDto)
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = this.orderRepository.create({
                shippingAddress: createOrderDto.shippingAddress,
                status: OrderStatus.PENDING,
            });

            const newOrderItems: OrderItemEntity[] = [];

            if (!_.isNil(createOrderDto.orderItems) || !_.isEmpty(createOrderDto.orderItems)) {
                const productIds = _.map(createOrderDto.orderItems, itemDto => itemDto.productId);
                const products = await this.productRepository.findBy({ id: In(productIds) });

                if (products.length !== productIds.length) {
                    const missingProductIds = _.filter(productIds,
                        id => !_.some(products, product => product.id === id)
                    );
                    throw new NotFoundException(`Products with IDs ${_.join(missingProductIds, ', ')} not found`);
                }

                for (let i = 0; i < createOrderDto.orderItems.length; i++) {
                    const itemDto = createOrderDto.orderItems[i];
                    const product = _.find(products, p => p.id === itemDto.productId);

                    const orderItem = this.orderItemRepository.create({
                        quantity: itemDto.quantity,
                        price: product.price,
                        product,
                        order,
                    });

                    newOrderItems.push(orderItem);
                }

                order.orderItems = newOrderItems;
                order.totalAmount = _.reduce(newOrderItems, (sum, item) => sum + item.price * item.quantity, 0);
            }

            const savedOrder = await queryRunner.manager.save(OrderEntity, order);

            for (const item of newOrderItems) {
                item.order = savedOrder;
            }

            await queryRunner.manager.save(OrderItemEntity, newOrderItems);

            await queryRunner.commitTransaction();

            return this.mapper.map(savedOrder, OrderEntity, OrderDto);

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingOrder = await this.orderRepository.findOne({
                where: { id },
                relations: ['orderItems', 'orderItems.product'],
            });

            if (!existingOrder) {
                throw new NotFoundException(`Order with ID ${id} not found`);
            }

            if (updateOrderDto.status) {
                existingOrder.status = updateOrderDto.status;
            }
            if (updateOrderDto.shippingAddress) {
                existingOrder.shippingAddress = updateOrderDto.shippingAddress;
            }

            if (!_.isNil(updateOrderDto.orderItems) || !_.isEmpty(updateOrderDto.orderItems)) {
                await queryRunner.manager.remove(existingOrder.orderItems);

                const productIds = _.map(updateOrderDto.orderItems, itemDto => itemDto.productId);
                const products = await this.productRepository.findBy({ id: In(productIds) });

                if (products.length !== productIds.length) {
                    const missingProductIds = _.filter(productIds,
                        id => !_.some(products, product => product.id === id)
                    );
                    throw new NotFoundException(`Products with IDs ${missingProductIds.join(', ')} not found`);
                }

                const newOrderItems: OrderItemEntity[] = [];

                for (let i = 0; i < updateOrderDto.orderItems.length; i++) {
                    const itemDto = updateOrderDto.orderItems[i];
                    const product = _.find(products, p => p.id === itemDto.productId);

                    if (!product) {
                        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
                    }

                    const orderItem = this.orderItemRepository.create({
                        quantity: itemDto.quantity,
                        price: product.price,
                        product,
                        order: existingOrder,
                    });

                    newOrderItems.push(orderItem);
                }

                existingOrder.orderItems = newOrderItems;

                existingOrder.totalAmount = _.reduce(newOrderItems,
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                );
            }

            const savedOrder = await queryRunner.manager.save(OrderEntity, existingOrder);

            await queryRunner.commitTransaction();

            return this.mapper.map(savedOrder, OrderEntity, OrderDto);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}