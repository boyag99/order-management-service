import { Global, Module } from '@nestjs/common';
import { RedlockModule as NestRedlockModule } from "@anchan828/nest-redlock";
import { ConfigModule } from '@libs/config';
import { RedlockConfigService } from './services/redlock-config.service';

@Global()
@Module({
  imports: [
    NestRedlockModule.registerAsync({
      imports: [ConfigModule],
      inject: [RedlockConfigService],
      useFactory: (redlockConfigService: RedlockConfigService) => redlockConfigService.options,
    }),
  ],
  providers: [RedlockConfigService],
  exports: [RedlockConfigService]
})
export class RedlockModule {}
