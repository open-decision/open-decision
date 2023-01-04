import { DocumentTemplateModel } from "@open-decision/models";
import { z } from "zod";

export const updateTemplateOutput = DocumentTemplateModel.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TUpdateTemplateOutput = z.infer<typeof updateTemplateOutput>;
