import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const deleteTemplateSingleOutput = DocumentTemplateModel.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TDeleteTemplateSingleOutput = z.infer<
  typeof deleteTemplateSingleOutput
>;
