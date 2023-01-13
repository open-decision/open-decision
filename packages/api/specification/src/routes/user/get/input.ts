import { z } from "zod";

export const getUserInput = z.void();

export type TGetUserInput = z.infer<typeof getUserInput>;
