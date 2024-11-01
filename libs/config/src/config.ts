import { IConfig } from './interfaces';

export default (): IConfig => ({
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port:  parseInt(String(process.env.DATABASE_PORT), 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,
  }
});
