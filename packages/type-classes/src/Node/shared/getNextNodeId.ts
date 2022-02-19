import * as BuilderNode from "../../Node/BuilderNode";
import * as PublicNode from "../../Node/PublicNode";

export const getNextNodeId = (
  node: BuilderNode.TNode | PublicNode.TNode,
  answer: string
) => {
  const nextNode = Object.values(node.relations).find(
    (relations) => relations.answer === answer
  );

  if (nextNode && nextNode.target) return nextNode.target;

  return new Error(`Next Node could not be found`);
};
