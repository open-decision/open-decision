import { z } from "zod";
import { hasRefreshTokenCookieInput } from "../shared";

export const refreshTokenInput = hasRefreshTokenCookieInput;

export type TRefreshTokenInput = z.infer<typeof refreshTokenInput>;
