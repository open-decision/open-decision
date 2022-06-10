import { PublishedTreeModel } from "@open-decision/models";
import { z } from "zod";

export const getPublishedTreeOutput = z.array(PublishedTreeModel);

export type TGetPublishedTreeOutput = z.infer<typeof getPublishedTreeOutput>;
