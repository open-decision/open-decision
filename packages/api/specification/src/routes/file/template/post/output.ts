import { DocumentTemplateModel } from "@open-decision/models";
import { z } from "zod";

export const createTemplateOutput = DocumentTemplateModel;

export type TCreateTemplateOutput = z.infer<typeof createTemplateOutput>;
