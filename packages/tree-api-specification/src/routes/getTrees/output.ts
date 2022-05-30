import { z } from "zod";
import { TreeOutput } from "../shared";

export const getTreesOutput = z.array(TreeOutput);

export type TGetTreesOutput = z.infer<typeof getTreesOutput>;
