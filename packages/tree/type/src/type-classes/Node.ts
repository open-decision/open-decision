import { z } from "zod";
import { JSONContent } from "@tiptap/core";

export const RichText: z.ZodSchema<JSONContent> = z.lazy(() =>
  z.record(z.any()).and(
    z.object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(RichText).optional(),
      marks: z
        .array(
          z.record(z.any()).and(
            z.object({
              type: z.string(),
              attrs: z.record(z.any()).optional(),
            })
          )
        )
        .optional(),
      text: z.string().optional(),
    })
  )
);

export const Coordinates = z.object({ x: z.number(), y: z.number() });

export const Type = z.object({
  id: z.string().uuid(),
  position: Coordinates,
  type: z.string(),
  data: z.object({
    name: z.string().optional(),
    content: RichText.optional(),
    inputs: z.array(z.string()),
    conditions: z.array(z.string()),
  }),
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TRecord = z.infer<typeof Record>;
export type TNodeData = TNode["data"];
export type TCoordinates = z.infer<typeof Coordinates>;
export type TRichText = z.infer<typeof RichText>;
