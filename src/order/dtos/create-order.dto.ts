import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "src/order-item/dtos/create-order-item.dto";
import { OrderStatus } from "../enums/order-status.enum";
import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @AutoMap()
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @AutoMap()
    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.PENDING,
        required: false,
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @AutoMap()
    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    shippingAddress?: string;

    @AutoMap()
    @ApiProperty({
        type: CreateOrderItemDto,
        isArray: true,
        required: false,
    })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @IsOptional()
    orderItems?: CreateOrderItemDto[];
}