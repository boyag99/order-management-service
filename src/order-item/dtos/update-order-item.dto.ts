import { PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "src/order/dtos/create-order.dto";

export class UpdateOrderItemDto extends PartialType(CreateOrderDto) { }