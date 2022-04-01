import { Tree, Node, Edge } from "@open-decision/type-classes";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore(id: string) {
  const yDoc = new Y.Doc({ guid: id });
  const yMap = yDoc.getMap("tree");
  let resolve;

  const nonSyncedStore = proxy({
    connectionSourceNodeId: "",
    validConnections: [] as string[],
    selection: { nodes: [], edges: [] } as { nodes: string[]; edges: string[] },
    synced: new Promise((r) => (resolve = r)),
  });

  const tree = proxy({
    startNode: undefined as string | undefined,
    nodes: [] as Node.TNodesArray,
    edges: [] as Edge.TEdgeArray,
  });

  const methods = Tree.createTreeMethods(tree);

  bindProxyAndYMap(tree, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  // ------------------------------------------------------------------
  // Selection

  function removeSelectedNodes(nodeIds?: string[]) {
    if (nodeIds)
      nonSyncedStore.selection.nodes.filter((nodeId) =>
        nodeIds.includes(nodeId)
      );
    return (nonSyncedStore.selection.nodes = []);
  }

  function addSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selection.nodes.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: string[]) {
    removeSelectedNodes();
    addSelectedNodes(nodeIds);
  }

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

  function connect(target: string, relationId: string) {
    if (nonSyncedStore.connectionSourceNodeId == null) return;

    methods.addEdge(
      { source: nonSyncedStore.connectionSourceNodeId, target },
      relationId
    );
  }

  return {
    resolve,
    tree,
    yDoc,
    nonSyncedStore,
    connect,
    abortConnecting,
    startConnecting,
    addSelectedNodes,
    removeSelectedNodes,
    replaceSelectedNodes,
    ...methods,
  };
}
