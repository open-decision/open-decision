import { z } from "zod";

export const requestTemplateUploadOutput = z.object({ token: z.string() });

export type TRequestTemplateUploadOutput = z.infer<
  typeof requestTemplateUploadOutput
>;
