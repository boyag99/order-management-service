import { RedlockModuleOptions } from '@anchan828/nest-redlock';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfigService } from './redis-config.service';

@Injectable()
export class RedlockConfigService {
  constructor(private redisConfigService: RedisConfigService) {}

  get options(): RedlockModuleOptions {
    return {
      clients: [new Redis(this.redisConfigService.options)],
      settings: {
        driftFactor: 0.01,
        retryCount: 10,
        retryDelay: 200,
        retryJitter: 200,
        automaticExtensionThreshold: 500,
      },
      duration: 1000,
    };
  }
}
