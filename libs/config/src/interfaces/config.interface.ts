import { RedisOptions } from "ioredis";
import { TApp } from "../types";
import { TDatabaseOptions } from "@libs/common";

export interface IConfig {
    app: TApp,
    database: TDatabaseOptions;
    redis: RedisOptions;
}