import { Controller, Body, Param, Put, Post, Get, NotFoundException, Catch, InternalServerErrorException, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderDto } from './dtos/order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import _ from 'lodash';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  @ApiResponse({ type: () => OrderDto })
  @ApiNotFoundResponse()
  async getOrder(
    @Param('id') id: number,
  ) {
    const order =  await this.orderService.getOrder(id);

    if (_.isNil(order.data) || _.isEmpty(order.data)) {
      throw new NotFoundException();
    }

    return order;
  }

  @Get()
  @ApiQuery({ type: () => GetOrdersDto })
  @ApiOkResponse({ type: () => OrderDto, isArray: true })
  async getOrders(
    @Query() getOrdersDto: GetOrdersDto
  ) {
    const orders = await this.orderService.getOrders(getOrdersDto);

    if (_.isNil(orders.data) || _.isEmpty(orders.data)) {
      throw new NotFoundException();
    }

    return orders;
  }

  @Post()
  @ApiBody({ type: () => CreateOrderDto })
  @ApiResponse({ type: () => OrderDto })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  @ApiBody({ type: () => UpdateOrderDto })
  @ApiResponse({ type: () => OrderDto })
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }
}