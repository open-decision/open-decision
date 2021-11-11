import * as PublicTree from "./PublicTree";
import * as BuilderTree from "./BuilderTree";
import { TransformToPublicNodes } from "../Node/transforms";
import * as PublicNode from "../Node/PublicNode";

export function TransformToPublicTree(tree: BuilderTree.TTree) {
  const transformedTree = BuilderTree.Type.transform(
    ({ id, treeName, nodes }) => {
      const transformedNodes = TransformToPublicNodes.safeParse(nodes);

      if (!transformedNodes.success) return transformedNodes;

      const parsedNodes = PublicNode.Record.safeParse(transformedNodes.data);

      if (!parsedNodes.success) return parsedNodes;

      const tree = { id, treeName, nodes: parsedNodes.data, checksum: 0 };
      tree.checksum = PublicTree.getTreeHash(tree);

      return PublicTree.Type.safeParse(tree);
    }
  ).safeParse(tree);

  if (!transformedTree.success) return transformedTree;

  return transformedTree.data;
}
