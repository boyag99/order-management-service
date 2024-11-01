import { Global, Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './config';
import { DatabaseConfigService } from '../../database/src/services/database-config.service';
import { RedisConfigService } from './services/redis-config.service';
import { RedlockConfigService } from '../../redlock/src/services/redlock-config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
  ],
  providers: [ConfigService, RedisConfigService],
  exports: [ConfigService, RedisConfigService],
})
export class ConfigModule {}
