import { z } from "zod";

export const deleteTreeOutput = z.void();

export type TDeleteTreeOutput = z.infer<typeof deleteTreeOutput>;
