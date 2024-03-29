import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const getTemplateFileSingleOutput = DocumentTemplateModel.extend({
  url: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetTemplateFileSingleOutput = z.infer<
  typeof getTemplateFileSingleOutput
>;
