import { z } from "zod";

export const forgotPasswordOutput = z.object({});

export type TForgotPasswordOutput = z.infer<typeof forgotPasswordOutput>;
