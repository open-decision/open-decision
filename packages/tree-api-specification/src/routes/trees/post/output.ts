import { z } from "zod";
import { TreeOutput } from "../../shared";

export const createTreeOutput = TreeOutput;

export type TCreateTreeOutput = z.infer<typeof TreeOutput>;
