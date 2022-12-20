import { DocumentTemplateModel } from "@open-decision/models";
import { z } from "zod";

export const updateTemplateOutput = DocumentTemplateModel;

export type TUpdateTemplateOutput = z.infer<typeof updateTemplateOutput>;
