import { useEditor } from "./useEditor";
import { pick } from "remeda";
import { useEdges } from "@open-decision/tree-sync";
import { useSnapshot } from "valtio";

export function useSelectedEdges() {
  const edges = useEdges();
  const selectedEdgeIds = useSelectedEdgeIds();

  if (!edges) return undefined;

  return Object.values(pick(edges, selectedEdgeIds));
}

export function useSelectedEdgeIds() {
  const { editorStore } = useEditor();
  const { selectedNodeIds } = useSnapshot(editorStore);

  return selectedNodeIds;
}
