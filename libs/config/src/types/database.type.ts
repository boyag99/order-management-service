import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export type TDatabaseOptions = Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions