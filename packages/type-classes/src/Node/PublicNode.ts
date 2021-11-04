import { Descendants } from "./RichTextContent";
import { z } from "zod";
import * as PublicRelation from "../Relation/PublicRelation";

export const Type = z.object({
  id: z.string(),
  name: z.string(),
  relations: z.record(PublicRelation.Type),
  content: Descendants,
});

export const Record = z.record(Type);

// ------------------------------------------------------------------
// Methods

export { getNextNodeId, hasRelation } from "./shared";

// ------------------------------------------------------------------
// Types

export type TNode = z.infer<typeof Type>;
export type TNodesRecord = z.infer<typeof Record>;
