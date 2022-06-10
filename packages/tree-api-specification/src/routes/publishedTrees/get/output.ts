import { PublishedTreeModel } from "@open-decision/models";
import { z } from "zod";

export const getPublishedTreesOutput = z.array(PublishedTreeModel);

export type TGetPublishedTreesOutput = z.infer<typeof getPublishedTreesOutput>;
