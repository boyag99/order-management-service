import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@libs/config';
import { DatabaseModule } from '@libs/database';
import { RedlockModule } from '@libs/redlock';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedlockModule,
    OrderModule,
    ProductModule,
    OrderItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
