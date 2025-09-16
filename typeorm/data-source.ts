import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config({
  path: process.env.ENV === 'test' ? '.env.test' : '.env',
})

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: [`${__dirname}/**/migrations/*.ts`],
})

export default dataSource
