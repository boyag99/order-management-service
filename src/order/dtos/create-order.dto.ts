import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "src/order-item/dtos/create-order-item.dto";
import { OrderStatus } from "../enums/order-status.enum";
import { AutoMap } from "@automapper/classes";

export class CreateOrderDto {  
    @AutoMap()
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @AutoMap()
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @AutoMap()
    @IsString()
    @IsOptional()
    shippingAddress?: string;
  
    @AutoMap()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @IsOptional()
    orderItems?: CreateOrderItemDto[];
}