import type { Options } from "@mikro-orm/core"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"
import * as dotenv from "dotenv"

dotenv.config()

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "5433"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  debug: true,
}

export default config
