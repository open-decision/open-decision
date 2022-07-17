import { z } from "zod";

export const resetPasswordOutput = z.void();

export type TResetPasswordOutput = z.infer<typeof resetPasswordOutput>;
