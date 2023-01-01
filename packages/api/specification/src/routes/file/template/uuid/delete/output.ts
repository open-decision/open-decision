import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const deleteTemplateSingleOutput = DocumentTemplateModel;

export type TDeleteTemplateSingleOutput = z.infer<
  typeof deleteTemplateSingleOutput
>;
