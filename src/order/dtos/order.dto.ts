import { AutoMap } from "@automapper/classes";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemDto } from "../../order-item/dtos/order-item.dto";
import { ApiProperty } from "@nestjs/swagger";

export class OrderDto {
    @ApiProperty()
    @AutoMap()
    id: number;

    @ApiProperty()
    @AutoMap()
    customerId: number;
  
    @ApiProperty({
      enum: OrderStatus,
      example: OrderStatus.PENDING,
  })
    @AutoMap()
    status: OrderStatus;
  
    @ApiProperty()
    @AutoMap()
    totalAmount: number;
  
    @ApiProperty()
    @AutoMap()
    shippingAddress: string;
  
    @ApiProperty({
      type: () => [OrderItemDto]
    })
    @AutoMap(() => [OrderItemDto])
    orderItems: OrderItemDto[];
}