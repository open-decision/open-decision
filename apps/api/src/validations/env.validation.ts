import { z } from "zod";

export const baseEnvVars = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  HOST: z.string().optional(),
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
  INSTANCE_NAME: z.string().optional().default("OD API"),
  PUBLIC_API_DOCUMENTATION: z.string().optional().default("false"),
  DEV_ACCOUNT_WHITELIST: z
    .string()
    .optional()
    .default("[]")
    .transform((str) => JSON.parse(str)),
  ADMIN_ACCOUNT_WHITELIST: z
    .string()
    .optional()
    .default("[]")
    .transform((str) => JSON.parse(str)),
  RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS: z
    .boolean()
    .optional()
    .default(false),
  AWS_S3_ACCESS_KEY_ID: z.string().optional(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().optional(),
  OD_BUILDER_ENDPOINT: z.string().optional(),
  DOCUMENT_TEMPLATE_BUCKET: z.string().default("od-document-generation"),
});

export type EnvVars = z.infer<typeof baseEnvVars>;
