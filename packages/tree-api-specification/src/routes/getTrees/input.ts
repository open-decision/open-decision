import { z } from "zod";

export const getTreesInput = z.object({});

export type TGetTreesInput = z.infer<typeof getTreesInput>;
