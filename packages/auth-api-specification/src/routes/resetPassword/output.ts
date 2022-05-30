import { z } from "zod";

export const resetPasswordOutput = z.object({});

export type TResetPasswordOutput = z.infer<typeof resetPasswordOutput>;
