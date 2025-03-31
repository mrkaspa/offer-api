import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "@/entities/User"

dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres", // You can change this to your preferred database
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "offer_db",
  synchronize: false, // Set to false in production and when using migrations
  logging: true,
  entities: [User],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
})
