import { z } from "zod";

export const logoutInput = z.object({});

export type TLogoutInput = z.infer<typeof logoutInput>;
