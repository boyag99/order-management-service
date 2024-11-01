import { ConfigModule } from '@libs/config';
import { DatabaseConfigService } from '@libs/database/services/database-config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (databaseConfigService: DatabaseConfigService) => databaseConfigService.options,
    })
  ],
})
export class DatabaseModule {}
