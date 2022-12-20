import { z } from "zod";
import { DocumentTemplateModel } from "./documentTemplate";

export const PublishedTemplateModel = DocumentTemplateModel.extend({
  originalTemplateUuid: z.string().uuid(),
  publishedTreeUuid: z.string().uuid(),
});
