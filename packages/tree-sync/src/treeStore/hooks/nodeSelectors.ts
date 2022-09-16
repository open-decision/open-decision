import { useSnapshot } from "valtio";
import { derive } from "valtio/utils";
import { useTreeClient, useTreeContext } from "../TreeContext";
import { mapValues, pick } from "remeda";
import { Node } from "@open-decision/type-classes";

export function useNode(id: string) {
  const { tree } = useTreeContext();

  const {
    tree: { nodes },
  } = useSnapshot(tree);

  return nodes?.[id];
}

export function useNodes(ids?: string[]): Node.TNodesRecord {
  const { tree } = useTreeContext();

  const {
    tree: { nodes },
  } = useSnapshot(tree);

  if (!nodes) return {};
  if (ids) return pick(nodes, ids);
  return nodes;
}

export function useParents(nodeId: string): { id: string; name?: string }[] {
  const {
    tree: { tree },
  } = useTreeContext();
  const treeClient = useTreeClient();

  const derivedNodeNames = derive({
    nodeNames: (get) => {
      const { nodes } = get(tree);

      return mapValues(nodes ?? {}, (node) => ({
        id: node.id,
        name: node.data.name,
      }));
    },
  });

  const { nodeNames } = useSnapshot(derivedNodeNames);

  const parentIds = treeClient.nodes.get.parents(nodeId);

  return Object.values(nodeNames).filter((nodeName) =>
    parentIds.includes(nodeName.id)
  );
}
