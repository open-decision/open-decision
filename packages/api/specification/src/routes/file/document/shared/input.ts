import { z } from "zod";

export const getDocumentSingleInput = z.object({
  params: z.object({
    uuid: z.string().uuid(),
  }),
  body: z.object({
    variables: z.object({}).passthrough(),
  }),
});

export type TGetDocumentSingleInput = z.infer<typeof getDocumentSingleInput>;
