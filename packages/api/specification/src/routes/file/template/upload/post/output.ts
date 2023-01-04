import { DocumentTemplateModel } from "@open-decision/models";
import { z } from "zod";

export const createTemplateOutput = DocumentTemplateModel.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TCreateTemplateOutput = z.infer<typeof createTemplateOutput>;
