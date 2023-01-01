import { z } from "zod";
import { PublishedTreeOutput } from "../../shared";

export const getPublishedTreesOutput = z.array(PublishedTreeOutput);

export type TGetPublishedTreesOutput = z.infer<typeof getPublishedTreesOutput>;
