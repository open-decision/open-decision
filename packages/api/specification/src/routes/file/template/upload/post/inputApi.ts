import { z } from "zod";

export const createTemplateInputApi = z.object({
  query: z.object({
    token: z.string(),
  }),
  body: z.object({ displayName: z.string() }),
  file: z.object({
    fieldname: z.literal("template"),
    originalname: z.string(),
    mimetype: z.literal(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ),
    buffer: z.any(),
    size: z.number(),
    encoding: z.string(),
  }),
});

export type TCreateTemplateInputApi = z.infer<typeof createTemplateInputApi>;
