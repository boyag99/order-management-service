import { RedisOptions } from "ioredis";
import { TApp, TDatabaseOptions } from "../types";

export interface IConfig {
    app: TApp,
    database: TDatabaseOptions;
    redis: RedisOptions;
}