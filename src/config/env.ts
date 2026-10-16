
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]).default("development"),

  PORT: z.coerce.number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  DATABASE_URL: z.string()
    .min(1, "DATABASE_URL is required")
    .refine(
      value => value.startsWith("postgresql://") ||
               value.startsWith("postgres://"),
      "Invalid PostgreSQL connection string"
    )
});

export const env = envSchema.parse(process.env);
