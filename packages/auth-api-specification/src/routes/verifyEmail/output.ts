import { z } from "zod";

export const verifyEmailOutput = z.object({});

export type TVerifyEmailOutput = z.infer<typeof verifyEmailOutput>;
