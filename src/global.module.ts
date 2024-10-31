import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { ConfigModule } from "@libs/config";
import { DatabaseModule } from "@libs/database";
import { RedlockModule } from "@libs/redlock";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [
      ConfigModule,
      DatabaseModule,
      RedlockModule,
      AutomapperModule.forRoot({
        strategyInitializer: classes(),
      })
    ]
  })
  export class GlobalModule {}
  