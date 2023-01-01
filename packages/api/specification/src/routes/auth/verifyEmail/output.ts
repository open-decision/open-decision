import { z } from "zod";

export const verifyEmailOutput = z.void();

export type TVerifyEmailOutput = z.infer<typeof verifyEmailOutput>;
