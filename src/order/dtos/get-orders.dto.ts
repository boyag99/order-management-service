import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "@libs/common/dtos/pagination.dto";
import { OrderStatus } from "../enums/order-status.enum";
import { IsEnum, IsOptional } from "class-validator";

export class GetOrdersDto extends PartialType(PaginationDto) {
    @ApiProperty({
        enum: OrderStatus,
        required: false,
        example: OrderStatus.PENDING,
      })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}