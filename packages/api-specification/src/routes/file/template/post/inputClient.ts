import { z } from "zod";

export const createTemplateInputClient = z.object({});

export type TCreateTemplateInputClient = z.infer<
  typeof createTemplateInputClient
>;
