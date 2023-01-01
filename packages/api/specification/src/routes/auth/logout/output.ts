import { z } from "zod";

export const logoutOutput = z.void();

export type TLogoutOutput = z.infer<typeof logoutOutput>;
