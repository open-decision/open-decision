import { z } from "zod";
import * as PublicRelation from "../Relation/PublicRelation";
import { BaseNode } from "./shared";

export const Type = BaseNode.extend({
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
