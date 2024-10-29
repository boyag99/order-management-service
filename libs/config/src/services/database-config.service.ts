import { TDatabaseOptions } from '@libs/config/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderEntity } from 'src/order/entities/order.entity';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get options(): TDatabaseOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
