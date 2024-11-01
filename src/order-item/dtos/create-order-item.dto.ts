import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";

export class CreateOrderItemDto {
    @AutoMap()
    @ApiProperty({
      example: 1,
      minimum: 1,
      required: false,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    quantity?: number;
  
    @AutoMap()
    @ApiProperty({
      required: false,
    })
    @IsNumber()
    @IsOptional()
    productId?: number;
  }