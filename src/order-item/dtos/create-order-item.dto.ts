import { AutoMap } from "@automapper/classes";
import { IsNumber, IsOptional } from "class-validator";

export class CreateOrderItemDto {
    @AutoMap()
    @IsNumber()
    @IsOptional()
    quantity?: number;
  
    @AutoMap()
    @IsNumber()
    @IsOptional()
    productId?: number;
}