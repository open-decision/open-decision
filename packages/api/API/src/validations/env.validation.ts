import { z } from "zod";
import { MailserverConfig } from "./mailserver.validation";
//TODO configure .env and env.example
export const EnvVars = z
  .object({
    NODE_ENV: z.enum(["production", "development", "test"]),
    HOST: z
      .string()
      .url({
        message:
          "Invalid hostname. Make sure to not include the protocoll (like https://) and to follow RFC 1123",
      })
      .optional(),
    PORT: z
      .string()
      .default("3000")
      .transform((str) => parseInt(str, 10)),
    DATABASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    JWT_ACCESS_EXPIRATION_MINUTES: z
      .string()
      .optional()
      .default("15")
      .transform((str) => parseInt(str, 10)),
    JWT_REFRESH_EXPIRATION_DAYS: z
      .string()
      .optional()
      .default("7")
      .transform((str) => parseInt(str, 10)),
    LOGIN_EXPIRATION_DAYS: z
      .string()
      .optional()
      .default("30")
      .transform((str) => parseInt(str, 10)),
    VERIFY_EMAIL_EXPIRATION_MINUTES: z
      .string()
      .optional()
      .default("30")
      .transform((str) => parseInt(str, 10)),
    RESET_PASSWORD_EXPIRATION_MINUTES: z
      .string()
      .optional()
      .default("30")
      .transform((str) => parseInt(str, 10)),
    SENTRY_DSN: z.string().optional(),
    INSTANCE_NAME: z.string().optional().default("OD Backend"),
  })
  .merge(MailserverConfig.partial());
