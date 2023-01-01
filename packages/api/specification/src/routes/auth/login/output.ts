import { z } from "zod";
import { authOuput } from "../shared";

export const loginOutput = authOuput;

export type TLoginOutput = z.infer<typeof loginOutput>;
