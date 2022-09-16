import { Node } from "@open-decision/type-classes";
import { useEditor } from "./useEditor";
import { pick } from "remeda";

export function useSelectedNodes():
  | ["none", undefined]
  | ["single", Node.TNode]
  | ["multi", Node.TNode[]] {
  const nodes = useNodes();
  const { selectedNodeIds } = useEditor();

  if (!nodes) return ["none", undefined];

  const selectedNodes = Object.values(pick(nodes, selectedNodeIds));

  if (selectedNodeIds.length === 1) return ["single", selectedNodes[0]];
  if (selectedNodeIds.length > 1) return ["multi", selectedNodes];

  return ["none", undefined];
}
