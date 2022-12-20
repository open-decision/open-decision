import { z } from "zod";
import { DocumentTemplateModel } from "@open-decision/models";

export const getTemplateCollectionOutput = z.array(DocumentTemplateModel);

export type TGetTemplateCollectionOutput = z.infer<
  typeof getTemplateCollectionOutput
>;
