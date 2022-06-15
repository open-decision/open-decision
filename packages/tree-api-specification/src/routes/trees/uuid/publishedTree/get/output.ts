import { z } from "zod";
import { PublishedTreeOutput } from "../../../../shared";

export const getPublishedTreesOfTreeOutput = z.array(PublishedTreeOutput);

export type TGetPublishedTreesOfTreeOutput = z.infer<
  typeof getPublishedTreesOfTreeOutput
>;
