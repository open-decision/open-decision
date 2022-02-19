import * as PublicRelation from "../Relation/PublicRelation";
import { z } from "zod";
import { RichTextContent } from "./RichTextContent";

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
