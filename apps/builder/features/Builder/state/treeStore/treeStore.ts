import { createUseTree, Tree } from "@open-decision/type-classes";
import { createExtendedTreeClient } from "@open-decision/type-classes";
import { proxy } from "valtio";
import { derive } from "valtio/utils";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import { mapValues } from "remeda";
import { SelectPlugin } from "@open-decision/select-input-plugin";
import { ComparePlugin } from "@open-decision/compare-condition-plugin";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore(id: string) {
  const yDoc = new Y.Doc({ guid: id });
  const yMap = yDoc.getMap("tree");

  const syncedStore = proxy<Tree.TTree>({
    startNode: undefined,
    nodes: undefined,
    edges: undefined,
    inputs: undefined,
  });

  let onSync = (_value: unknown) => {
    return;
  };

  const nonSyncedStore = proxy({
    connectionSourceNodeId: "",
    validConnections: [] as string[],
    synced: new Promise((r) => (onSync = r)),
    selectedNodeIds: [] as string[],
    selectedEdgeIds: [] as string[],
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

  const treeClientConfig = createExtendedTreeClient((treeClient) => ({
    input: {
      select: new SelectPlugin(treeClient),
      // freeText: new FreeTextPlugin(treeClient),
    },
    condition: { compare: new ComparePlugin(treeClient) },
  }));
  const useTreeClient = createUseTree(syncedStore, treeClientConfig);

  const treeClient = treeClientConfig(syncedStore);

  const tree = proxy({
    syncedStore,
    nonSyncedStore,
  });

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  // ------------------------------------------------------------------
  // Connection

  function startConnecting(sourceNodeId: string) {
    const connectionOriginNode = treeClient.nodes.get.byId(sourceNodeId);
    if (!connectionOriginNode) return;

    nonSyncedStore.connectionSourceNodeId = sourceNodeId;

    const validConnections = treeClient.nodes.get.connectableNodes(
      connectionOriginNode.id
    );

    nonSyncedStore.validConnections = validConnections;
  }

  function abortConnecting() {
    nonSyncedStore.connectionSourceNodeId = "";
    nonSyncedStore.validConnections = [];
  }

  function addSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selectedNodeIds.push(...nodeIds);
  }

  function replaceSelectedNodes(nodeIds: string[]) {
    nonSyncedStore.selectedNodeIds = nodeIds;
  }

  function removeSelectedNodes() {
    nonSyncedStore.selectedNodeIds = [];
  }

  function removeSelectedNode(nodeId: string) {
    const nodeIndex = nonSyncedStore.selectedNodeIds.findIndex(
      (id) => id === nodeId
    );
    nonSyncedStore.selectedNodeIds.splice(nodeIndex, 1);
  }
  function addSelectedEdges(edgeIds: string[]) {
    nonSyncedStore.selectedEdgeIds.push(...edgeIds);
  }

  function replaceSelectedEdges(edgeIds: string[]) {
    nonSyncedStore.selectedEdgeIds = edgeIds;
  }

  function removeSelectedEdges() {
    nonSyncedStore.selectedEdgeIds = [];
  }

  function removeSelectedEdge(edgeId: string) {
    const edgeIndex = nonSyncedStore.selectedEdgeIds.findIndex(
      (id) => id === edgeId
    );
    nonSyncedStore.selectedEdgeIds.splice(edgeIndex, 1);
  }

  return {
    tree,
    derivedNodeNames,
    yDoc,
    onSync,
    abortConnecting,
    startConnecting,
    addSelectedNodes,
    replaceSelectedEdges,
    replaceSelectedNodes,
    removeSelectedEdge,
    removeSelectedEdges,
    removeSelectedNode,
    removeSelectedNodes,
    addSelectedEdges,
    getTreeData: () => yMap.toJSON(),
    treeClient,
    treeClientConfig,
    useTreeClient,
  };
}
