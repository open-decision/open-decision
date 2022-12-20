import { z } from "zod";
import { authOuput } from "../shared";

export const refreshTokenOutput = authOuput;

export type TRefreshTokenOutput = z.infer<typeof refreshTokenOutput>;
