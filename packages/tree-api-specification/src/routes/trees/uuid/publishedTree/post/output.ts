import { z } from "zod";

export const createPublishedTreeOutput = z.object({});

export type TCreatePublishedTreeOutput = z.infer<
  typeof createPublishedTreeOutput
>;
