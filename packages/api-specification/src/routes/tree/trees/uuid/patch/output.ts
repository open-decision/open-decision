import { z } from "zod";

export const updateTreeOutput = z.void();

export type TUpdateTreeOutput = z.infer<typeof updateTreeOutput>;
