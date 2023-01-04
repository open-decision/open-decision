import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const getTemplateSingleOutput = DocumentTemplateModel.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetTemplateSingleOutput = z.infer<typeof getTemplateSingleOutput>;
