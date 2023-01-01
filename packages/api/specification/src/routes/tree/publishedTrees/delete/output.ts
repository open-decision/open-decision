import { z } from "zod";

export const deletePublishedTreeOutput = z.void();

export type TDeletePublishedTreeOutput = z.infer<
  typeof deletePublishedTreeOutput
>;
