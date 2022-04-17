import { Tree, Node, Edge, Input } from "@open-decision/type-classes";
import { proxy } from "valtio";
import { derive } from "valtio/utils";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
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

  const derivedNodeNames = derive({
    nodeNames: (get) => {
      const { nodes } = get(tree);

      return mapValues(nodes ?? {}, (node) => ({
        id: node.id,
        name: node.data.name,
      }));
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
    derivedNodeNames,
    yDoc,
    nonSyncedStore,
    abortConnecting,
    startConnecting,
    getTreeData: () => yMap.toJSON(),
    ...methods,
  };
}
