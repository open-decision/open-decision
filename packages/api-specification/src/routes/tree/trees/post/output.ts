import { z } from "zod";
import { TreeOutput } from "../../shared";

export const createTreeOutput = TreeOutput;

export type TCreateTreeOutput = Omit<
  z.infer<typeof TreeOutput>,
  "publishedTrees"
>;
