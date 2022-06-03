import { z } from "zod";
import { TreeOutput } from "../shared";

export const getTreeOutput = TreeOutput;

export type TGetTreeOutput = z.infer<typeof TreeOutput>;
