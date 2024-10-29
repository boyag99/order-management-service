import { IConfig } from './interfaces';

export default (): IConfig => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.PORT) : 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  }
});
