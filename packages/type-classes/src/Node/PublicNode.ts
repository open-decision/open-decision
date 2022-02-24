import * as PublicRelation from "../Relation/PublicRelation";
import { z } from "zod";

export type JSONContent = {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};

export type HTMLContent = string;

export type RichTextContent = HTMLContent | JSONContent | JSONContent[] | null;

const JSONContent: z.ZodSchema<JSONContent> = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    attrs: z.record(z.any()).optional(),
    content: z.array(JSONContent),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.any()).optional(),
        })
      )
      .optional(),
    text: z.string().optional(),
  })
);

export const RichTextContent = z.union([
  JSONContent,
  z.array(JSONContent),
  z.string(),
  z.null(),
]);

export const Type = z.object({
  id: z.string().uuid(),
  content: RichTextContent,
  relations: z.record(PublicRelation.Type),
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Methods

export { getNextNodeId, hasRelation } from "./shared";

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TNodesRecord = z.infer<typeof Record>;
