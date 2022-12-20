import { z } from "zod";

export const getTemplateCollectionInput = z.void();

export type TGetTemplateCollectionInput = z.infer<
  typeof getTemplateCollectionInput
>;
