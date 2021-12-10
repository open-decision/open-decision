import { z } from "zod";
import { MailserverConfig } from "./mailserver.validation";
//TODO configure .env and env.example
export const EnvVars = z
  .object({
    NODE_ENV: z.enum(["production", "development", "test"]),
    HOST: z.string().url({
      message:
        "Invalid hostname. Make sure to not include the protocoll (like https://) and to follow RFC 1123",
    }),
    PORT: z.number().default(3000),
    DATABASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    JWT_ACCESS_EXPIRATION_MINUTES: z.number().default(15),
    JWT_REFRESH_EXPIRATION_DAYS: z.number().default(30),
    VERIFY_EMAIL_EXPIRATION_MINUTES: z.number().default(30),
    RESET_PASSWORD_EXPIRATION_MINUTES: z.number().default(30),
  })
  .merge(MailserverConfig.partial());
