import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const getTemplateSingleOutput = DocumentTemplateModel;

export type TGetTemplateSingleOutput = z.infer<typeof getTemplateSingleOutput>;
