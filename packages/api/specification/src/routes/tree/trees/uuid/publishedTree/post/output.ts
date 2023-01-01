import { z } from "zod";
import { PublishedTreeOutput } from "../../../../shared";

export const createPublishedTreeOutput = PublishedTreeOutput;

export type TCreatePublishedTreeOutput = z.infer<
  typeof createPublishedTreeOutput
>;
