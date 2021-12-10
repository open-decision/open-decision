import { z } from "zod";

export const MailserverConfig = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.number(),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  EMAIL_FROM_ADDRESS: z.string().email(),
  EMAIL_SENDER_NAME: z.string().optional().default("Open Decision"),
  EMAIL_REPLY_TO_ADDRESS: z.string().email().optional(),
});
