import { z } from "zod";

export const logoutOutput = z.object({});

export type TLogoutOutput = z.infer<typeof logoutOutput>;
