// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
