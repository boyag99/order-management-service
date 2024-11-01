import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { NotFoundException } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { DEFAULT_MAPPER_TOKEN } from '@automapper/nestjs';

describe('OrderService', () => {
    let service: OrderService;
    let orderRepository: Repository<OrderEntity>;
    let orderItemRepository: Repository<OrderItemEntity>;
    let productRepository: Repository<ProductEntity>;
    let dataSource: DataSource;
    let mapper: Mapper;

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            remove: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: getRepositoryToken(OrderEntity),
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(OrderItemEntity),
                    useValue: {
                        create: jest.fn().mockImplementation((dto) => dto),
                    },
                },
                {
                    provide: getRepositoryToken(ProductEntity),
                    useValue: {
                        findBy: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
                    },
                },
                {
                    provide: DEFAULT_MAPPER_TOKEN,
                    useValue: {
                        map: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        orderRepository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
        orderItemRepository = module.get<Repository<OrderItemEntity>>(getRepositoryToken(OrderItemEntity));
        productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
        dataSource = module.get<DataSource>(DataSource);
        mapper = module.get<Mapper>(DEFAULT_MAPPER_TOKEN);
    });

    describe('createOrder', () => {
        it('should create an order successfully', async () => {
            const createOrderDto: CreateOrderDto = {
                customerId: 1,
                shippingAddress: '123 HCM City',
                orderItems: [
                    { productId: 1, quantity: 2 },
                ],
            };

            const mockProduct = {
                id: 1,
                price: 10,
            };

            const mockOrder = {
                id: 1,
                customerId: 1,
                status: OrderStatus.PENDING,
                shippingAddress: '123 HCM City',
                orderItems: [],
            };

            jest.spyOn(productRepository, 'findBy').mockResolvedValue([mockProduct as ProductEntity]);
            jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder as OrderEntity);
            jest.spyOn(orderItemRepository, 'create').mockReturnValue({
                quantity: 2,
                price: 10,
            } as OrderItemEntity);
            jest.spyOn(mockQueryRunner.manager, 'save').mockResolvedValue(mockOrder);
            jest.spyOn(mapper, 'map').mockReturnValue({ ...mockOrder });

            const result = await service.createOrder(createOrderDto);

            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.customerId).toBe(createOrderDto.customerId);
        });

        it('should throw NotFoundException when product not found', async () => {
            const createOrderDto: CreateOrderDto = {
                customerId: 1,
                orderItems: [
                    { productId: 999, quantity: 2 },
                ],
            };

            jest.spyOn(productRepository, 'findBy').mockResolvedValue([]);

            await expect(service.createOrder(createOrderDto)).rejects.toThrow(NotFoundException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should handle transaction rollback on error', async () => {
            const createOrderDto: CreateOrderDto = {
                customerId: 1,
                orderItems: [
                    { productId: 1, quantity: 2 },
                ],
            };

            jest.spyOn(productRepository, 'findBy').mockRejectedValue(new Error('Database error'));

            await expect(service.createOrder(createOrderDto)).rejects.toThrow('Database error');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('updateOrder', () => {
        const orderId = 1;

        it('should update an order successfully', async () => {
            const updateOrderDto: UpdateOrderDto = {
                status: OrderStatus.PAID,
                shippingAddress: '456 New HCM City',
                orderItems: [
                    { productId: 1, quantity: 3 },
                ],
            };

            const existingOrder = {
                id: orderId,
                customerId: 1,
                status: OrderStatus.PENDING,
                shippingAddress: '123 Old HCM City',
                orderItems: [
                    { id: 1, quantity: 2, price: 10 },
                ],
            };

            const mockProduct = {
                id: 1,
                price: 10,
            };

            jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder as OrderEntity);
            jest.spyOn(productRepository, 'findBy').mockResolvedValue([mockProduct as ProductEntity]);
            jest.spyOn(orderItemRepository, 'create').mockReturnValue({
                quantity: 3,
                price: 10,
            } as OrderItemEntity);
            jest.spyOn(mockQueryRunner.manager, 'save').mockResolvedValue({
                ...existingOrder,
                ...updateOrderDto,
            });
            jest.spyOn(mapper, 'map').mockReturnValue({
                ...existingOrder,
                ...updateOrderDto,
            });

            const result = await service.updateOrder(orderId, updateOrderDto);

            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.status).toBe(updateOrderDto.status);
            expect(result.shippingAddress).toBe(updateOrderDto.shippingAddress);
        });

        it('should throw NotFoundException when order not found', async () => {
            const updateOrderDto: UpdateOrderDto = {
                status: OrderStatus.PAID,
            };

            jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

            await expect(service.updateOrder(orderId, updateOrderDto))
                .rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when updating with non-existent products', async () => {
            const updateOrderDto: UpdateOrderDto = {
                orderItems: [
                    { productId: 999, quantity: 2 },
                ],
            };

            const existingOrder = {
                id: orderId,
                customerId: 1,
                status: OrderStatus.PENDING,
                orderItems: [],
            };

            jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder as OrderEntity);
            jest.spyOn(productRepository, 'findBy').mockResolvedValue([]);

            await expect(service.updateOrder(orderId, updateOrderDto))
                .rejects.toThrow(NotFoundException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should update order status only', async () => {
            const updateOrderDto: UpdateOrderDto = {
                status: OrderStatus.SHIPPED,
            };

            const existingOrder = {
                id: orderId,
                customerId: 1,
                status: OrderStatus.PAID,
                orderItems: [],
            };

            const updatedOrder = {
                ...existingOrder,
                status: OrderStatus.SHIPPED,
            };

            jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder as OrderEntity);
            jest.spyOn(mockQueryRunner.manager, 'save').mockResolvedValue(updatedOrder);
            jest.spyOn(mapper, 'map').mockReturnValue(updatedOrder);

            const result = await service.updateOrder(orderId, updateOrderDto);

            expect(result.status).toBe(OrderStatus.SHIPPED);
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should handle transaction rollback on update error', async () => {
            const updateOrderDto: UpdateOrderDto = {
                status: OrderStatus.PAID,
            };

            jest.spyOn(orderRepository, 'findOne').mockRejectedValue(new Error('Database error'));

            await expect(service.updateOrder(orderId, updateOrderDto))
                .rejects.toThrow('Database error');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should calculate correct total amount when updating order items', async () => {
            const updateOrderDto: UpdateOrderDto = {
                orderItems: [
                    { productId: 1, quantity: 2 },
                    { productId: 2, quantity: 3 },
                ],
            };

            const existingOrder = {
                id: orderId,
                customerId: 1,
                status: OrderStatus.PENDING,
                orderItems: [],
            };

            const mockProducts = [
                { id: 1, price: 10 },
                { id: 2, price: 15 },
            ];

            const mockOrderItems = [
                { quantity: 2, price: 10, product: mockProducts[0] },
                { quantity: 3, price: 15, product: mockProducts[1] },
            ];

            const expectedTotalAmount = (2 * 10) + (3 * 15); // 65

            jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder as OrderEntity);
            jest.spyOn(productRepository, 'findBy').mockResolvedValue(mockProducts as ProductEntity[]);
            jest.spyOn(orderItemRepository, 'create').mockImplementation((dto) => {
                const product = mockProducts.find(p => p.id === dto.product.id);
                return {
                    quantity: dto.quantity,
                    price: product.price,
                    product: product,
                    order: dto.order,
                } as OrderItemEntity;
            });

            jest.spyOn(mockQueryRunner.manager, 'save').mockImplementation((entity) => {
                if (entity instanceof OrderEntity) {
                    return Promise.resolve({
                        ...entity,
                        totalAmount: expectedTotalAmount,
                        orderItems: mockOrderItems,
                    });
                }
                return Promise.resolve(entity);
            });

            jest.spyOn(mapper, 'map').mockImplementation((entity) => ({
                ...entity,
                orderItems: mockOrderItems,
                totalAmount: expectedTotalAmount,
            }));

            const result = await service.updateOrder(orderId, updateOrderDto);

            expect(result.totalAmount).toBe(expectedTotalAmount);
            expect(result.orderItems).toHaveLength(2);
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
    });
})