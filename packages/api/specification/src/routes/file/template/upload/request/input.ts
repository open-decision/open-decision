import { z } from "zod";

export const requestTemplateUploadInput = z.object({
  body: z.object({
    treeUuid: z.string().uuid(),
    templateUuid: z.string().uuid().optional(),
  }),
});

export type TRequestTemplateUploadInput = z.infer<
  typeof requestTemplateUploadInput
>;
