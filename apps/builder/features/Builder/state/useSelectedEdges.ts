import { useEditor } from "./useEditor";
import { pick } from "remeda";
import { useSnapshot } from "valtio";
import { getEdges, useTree } from "@open-decision/tree-sync";

export function useSelectedEdges() {
  const edges = useTree((tree) => getEdges(tree)());
  const selectedEdgeIds = useSelectedEdgeIds();

  if (!edges) return undefined;

  return Object.values(pick(edges, selectedEdgeIds));
}

export function useSelectedEdgeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
