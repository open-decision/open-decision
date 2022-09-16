import { useSnapshot } from "valtio";
import { useTreeClient, useTreeContext } from "../TreeContext";
import { mapValues, pick } from "remeda";
import { isEmpty } from "ramda";

export function useNode(id: string) {
  const { tree } = useTreeContext();

  const {
    tree: { nodes },
  } = useSnapshot(tree);

  return nodes?.[id];
}

export function useNodes(ids?: string[]) {
  const { tree } = useTreeContext();

  const {
    tree: { nodes },
  } = useSnapshot(tree);

  if (!nodes || isEmpty(nodes) || isEmpty(ids)) return undefined;

  if (ids) return pick(nodes, ids);
  return nodes;
}

export function useNodeNames() {
  const {
    tree: { tree },
  } = useTreeContext();
  const { nodes } = useSnapshot(tree);

  return mapValues(nodes ?? {}, (node) => ({
    id: node.id,
    name:
      node.data.name && node.data.name.length > 0
        ? node.data.name
        : "Kein Name",
  }));
}

export function useParents(nodeId: string): { id: string; name?: string }[] {
  const treeClient = useTreeClient();
  const nodeNames = useNodeNames();

  const parentIds = treeClient.nodes.get.parents(nodeId);

  return Object.values(nodeNames).filter((nodeName) =>
    parentIds.includes(nodeName.id)
  );
}

export function useChildren(nodeId: string) {
  const treeClient = useTreeClient();
  const nodeNames = useNodeNames();

  const childIds = treeClient.nodes.get.children(nodeId);

  return Object.values(nodeNames).filter((nodeName) =>
    childIds.includes(nodeName.id)
  );
}
