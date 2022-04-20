import { Tree, Node, Edge, Input } from "@open-decision/type-classes";
import { proxy } from "valtio";
import { derive } from "valtio/utils";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import { mapValues } from "remeda";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export let resolve;

const nonSyncedStore = proxy({
  connectionSourceNodeId: "",
  validConnections: [] as string[],
  synced: new Promise((r) => (resolve = r)),
  selectedNodeIds: [] as string[],
  selectedEdgeIds: [] as string[],
});

export function addSelectedNodes(nodeIds: string[]) {
  nonSyncedStore.selectedNodeIds.push(...nodeIds);
}

export function replaceSelectedNodes(nodeIds: string[]) {
  nonSyncedStore.selectedNodeIds = nodeIds;
}

export function removeSelectedNodes() {
  nonSyncedStore.selectedNodeIds = [];
}

export function removeSelectedNode(nodeId: string) {
  const nodeIndex = nonSyncedStore.selectedNodeIds.findIndex(
    (id) => id === nodeId
  );
  nonSyncedStore.selectedNodeIds.splice(nodeIndex, 1);
}
export function addSelectedEdges(edgeIds: string[]) {
  nonSyncedStore.selectedEdgeIds.push(...edgeIds);
}

export function replaceSelectedEdges(edgeIds: string[]) {
  nonSyncedStore.selectedEdgeIds = edgeIds;
}

export function removeSelectedEdges() {
  nonSyncedStore.selectedEdgeIds = [];
}

export function removeSelectedEdge(edgeId: string) {
  const edgeIndex = nonSyncedStore.selectedEdgeIds.findIndex(
    (id) => id === edgeId
  );
  nonSyncedStore.selectedEdgeIds.splice(edgeIndex, 1);
}

export function createTreeStore(id: string) {
  const yDoc = new Y.Doc({ guid: id });
  const yMap = yDoc.getMap("tree");

  const syncedStore = proxy<Tree.TTree>({
    startNode: undefined as string | undefined,
    nodes: undefined as Node.TNodesRecord | undefined,
    edges: undefined as Edge.TEdgesRecord | undefined,
    inputs: undefined as Input.TInputsRecord | undefined,
  });

  const derivedNodeNames = derive({
    nodeNames: (get) => {
      const { nodes } = get(syncedStore);

      return mapValues(nodes ?? {}, (node) => ({
        id: node.id,
        name: node.data.name,
      }));
    },
  });

  const tree = proxy({
    syncedStore,
    nonSyncedStore,
  });

  const methods = Tree.createTreeMethods(syncedStore);

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  // ------------------------------------------------------------------
  // Connection

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = methods.getNode(sourceNodeId);
    if (!connectionOriginNode) return;

    nonSyncedStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = methods.getConnectableNodes(
      connectionOriginNode.id
    );

    nonSyncedStore.validConnections = validConnections;
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  return {
    tree,
    derivedNodeNames,
    yDoc,
    abortConnecting,
    startConnecting,
    getTreeData: () => yMap.toJSON(),
    ...methods,
  };
}
