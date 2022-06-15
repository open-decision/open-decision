import { z } from "zod";
import { authOuput } from "../shared";

export const registerOutput = authOuput;

export type TRegisterOutput = z.infer<typeof registerOutput>;
