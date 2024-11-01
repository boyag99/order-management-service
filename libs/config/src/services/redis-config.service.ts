import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  get options(): RedisOptions {
    return {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    };
  }
}
