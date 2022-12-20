import { z } from "zod";

export const forgotPasswordOutput = z.void();

export type TForgotPasswordOutput = z.infer<typeof forgotPasswordOutput>;
