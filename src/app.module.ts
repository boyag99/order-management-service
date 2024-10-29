import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@libs/config';
import { DatabaseModule } from '@libs/database';
import { RedlockModule } from '@libs/redlock';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    RedlockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
