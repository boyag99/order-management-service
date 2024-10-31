import { AutoMap } from "@automapper/classes";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemDto } from "src/order-item/dtos/order-item.dto";

export class OrderDto {
    @AutoMap()
    id: number;

    @AutoMap()
    customerId: number;
  
    @AutoMap()
    status: OrderStatus;
  
    @AutoMap()
    totalAmount: number;
  
    @AutoMap()
    shippingAddress: string;
  
    @AutoMap(() => [OrderItemDto])
    orderItems: OrderItemDto[];
  }