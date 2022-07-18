import { z } from "zod";

export const createPublishedTreeOutput = z.void();

export type TCreatePublishedTreeOutput = z.infer<
  typeof createPublishedTreeOutput
>;
