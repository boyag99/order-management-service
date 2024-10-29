import { RedisOptions } from "ioredis";
import { TDatabaseOptions } from "../types";

export interface IConfig {
    database: TDatabaseOptions;
    redis: RedisOptions;
}