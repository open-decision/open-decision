import { z } from "zod";
import { hasRefreshTokenInput } from "../shared";

export const refreshTokenInput = hasRefreshTokenInput;

export type TRefreshTokenInput = z.infer<typeof refreshTokenInput>;
