import { OmitType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends OmitType(CreateOrderDto, ['customerId']) { }