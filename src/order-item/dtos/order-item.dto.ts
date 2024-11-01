import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap()
  quantity: number;

  @ApiProperty()
  @AutoMap()
  price: number;

  @ApiProperty()
  @AutoMap()
  productId: number;

  @ApiProperty()
  @AutoMap()
  orderId: number;
}
