import { createMap, forMember, ignore, mapFrom, Mapper } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "src/order-item/entities/order-item.entity";
import { OrderItemDto } from "src/order-item/dtos/order-item.dto";
import { OrderDto } from "./dtos/order.dto";

@Injectable()
export class OrderMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        OrderEntity,
        OrderDto,
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id)
        ),
        forMember(
          (dest) => dest.status,
          mapFrom((src) => src.status)
        ),
        forMember(
          (dest) => dest.totalAmount,
          mapFrom((src) => src.totalAmount)
        ),
        forMember(
          (dest) => dest.shippingAddress,
          mapFrom((src) => src.shippingAddress)
        ),
        forMember(
          (dest) => dest.orderItems,
          mapFrom((src) => src.orderItems.map((item) => mapper.map(item, OrderItemEntity, OrderItemDto)))
        )
      );

      createMap(
        mapper,
        OrderItemEntity,
        OrderItemDto,
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id)
        ),
        forMember(
          (dest) => dest.quantity,
          mapFrom((src) => src.quantity)
        ),
        forMember(
          (dest) => dest.price,
          mapFrom((src) => src.price)
        ),
        forMember(
          (dest) => dest.productId,
          mapFrom((src) => (src.product ? src.product.id : null)) 
        ),
        forMember(
          (dest) => dest.orderId,
          mapFrom((src) => (src.order ? src.order.id : null))
        )
      );
    };
  }
}