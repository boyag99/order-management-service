import { Global, Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './config';
import { DatabaseConfigService } from './services/database-config.service';
import { RedisConfigService } from './services/redis-config.service';
import { RedlockConfigService } from './services/redlock-config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
  ],
  providers: [ConfigService, DatabaseConfigService, RedisConfigService, RedlockConfigService],
  exports: [ConfigService, DatabaseConfigService, RedisConfigService, RedlockConfigService],
})
export class ConfigModule {}
