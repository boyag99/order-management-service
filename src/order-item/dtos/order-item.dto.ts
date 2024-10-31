import { AutoMap } from "@automapper/classes";

export class OrderItemDto {
    @AutoMap()
    id: number;
  
    @AutoMap()
    quantity: number;
  
    @AutoMap()
    price: number;
  
    @AutoMap()
    productId: number;

    @AutoMap()
    orderId: number;
  }
  