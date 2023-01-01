import { z } from "zod";

export const updateTemplateInput = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
  body: z.object({
    displayName: z.string(),
  }),
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

export type TUpdateTemplateInput = z.infer<typeof updateTemplateInput>;
