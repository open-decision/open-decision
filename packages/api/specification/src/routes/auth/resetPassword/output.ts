import { z } from "zod";
import { authOuput } from "../shared";

export const resetPasswordOutput = authOuput;

export type TResetPasswordOutput = z.infer<typeof resetPasswordOutput>;
