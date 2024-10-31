import { Controller, Body, Param, Put, Post, Get, NotFoundException, Catch, InternalServerErrorException } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderDto } from './dtos/order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import _ from 'lodash';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  async getOrder(
    @Param('id') id: number,
  ): Promise<OrderDto> {
    const order =  await this.orderService.getOrder(id);

    if (_.isNil(order) || _.isEmpty(order)) {
      throw new NotFoundException();
    }

    return order;
  }

  @Get()
  async getOrders(
  ): Promise<OrderDto[]> {
    const orders = await this.orderService.getOrders();

    if (_.isNil(orders) || _.isEmpty(orders)) {
      throw new NotFoundException();
    }

    return orders;
  }

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }
}