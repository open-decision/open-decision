import { Tree, Node, Edge, Input } from "@open-decision/type-classes";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import { derive } from "valtio/utils";
import { mapValues } from "remeda";

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
    synced: new Promise((r) => (resolve = r)),
  });

  const tree = proxy<Tree.TTree>({
    startNode: undefined as string | undefined,
    nodes: undefined as Node.TNodesRecord | undefined,
    edges: undefined as Edge.TEdgesRecord | undefined,
    inputs: undefined as Input.TInputsRecord | undefined,
  });

  const { nodeData } = derive({
    nodeData: (get) => {
      if (!tree.nodes) return {};
      const nodes = get(tree.nodes);

      return mapValues(nodes ?? {}, (node) => ({ id: node.id, ...node.data }));
    },
  });

  const methods = Tree.createTreeMethods(tree);

  bindProxyAndYMap(tree, yMap, {
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
    resolve,
    tree,
    nodeData,
    yDoc,
    nonSyncedStore,
    abortConnecting,
    startConnecting,
    ...methods,
  };
}
