import { isEmpty } from "ramda";
import { filter, isNot, pipe, values } from "remeda";
import * as BuilderNode from "../../Node/BuilderNode";
import * as PublicNode from "../../Node/PublicNode";

export const hasRelation = (
  node: BuilderNode.TNode | PublicNode.TNode,
  targetId: string
) =>
  pipe(
    node.data.relations,
    values,
    filter((relation) => relation.target === targetId),
    isNot(isEmpty)
  );
