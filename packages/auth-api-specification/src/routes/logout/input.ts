import { z } from "zod";
import { hasRefreshTokenCookieInput } from "../shared";

export const logoutInput = hasRefreshTokenCookieInput;

export type TLogoutInput = z.infer<typeof logoutInput>;
