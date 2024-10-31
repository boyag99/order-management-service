import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { OrderItemModule } from './order-item/order-item.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    GlobalModule,
    OrderModule,
    ProductModule,
    OrderItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
