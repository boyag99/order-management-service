import { Global, Module } from '@nestjs/common';
import { RedlockModule as NestRedlockModule } from "@anchan828/nest-redlock";
import { ConfigModule } from '@libs/config';
import { RedlockConfigService } from '@libs/config/services';

@Global()
@Module({
  imports: [
    NestRedlockModule.registerAsync({
      imports: [ConfigModule],
      inject: [RedlockConfigService],
      useFactory: (redlockConfigService: RedlockConfigService) => redlockConfigService.options,
    }),
  ]
})
export class RedlockModule {}
