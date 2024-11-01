import { DataSource, DataSourceOptions } from "typeorm";
import InitSeeder from "../seeds/init.seeder";
import { SeederOptions } from "typeorm-extension";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot({
    envFilePath: '.env',
});

const options = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    entities: [__dirname + '/../../../../src/**/*.entity.ts'],
    seeds: [InitSeeder],
};

export const source = new DataSource(
    options as DataSourceOptions & SeederOptions,
);