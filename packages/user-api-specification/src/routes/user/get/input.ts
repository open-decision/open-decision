import { z } from "zod";

export const getUserInput = z.object({});

export type TGetUserInput = z.infer<typeof getUserInput>;
