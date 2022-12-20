import { z } from "zod";
import { PublishedTreeOutput } from "../../../shared";

export const getPublishedTreeOutput = PublishedTreeOutput;

export type TGetPublishedTreeOutput = z.infer<typeof getPublishedTreeOutput>;
