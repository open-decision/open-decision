import { Tree } from "@open-decision/type-classes";
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

  const syncedStore = proxy<Tree.TTree>({} as Tree.TTree);

  let onSync = (_value: unknown) => {
    return;
  };

  const nonSyncedStore = proxy({
    connectionSourceNodeId: "",
    validConnections: [] as string[],
    synced: new Promise((r) => {
      if (typeof window === "undefined") return r(true);
      onSync = r;
    }),
    selectedNodeIds: [] as string[],
    selectedEdgeIds: [] as string[],
    selectedView: "editor",
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

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  return {
    tree,
    derivedNodeNames,
    yDoc,
    onSync,
    getTreeData: () => yMap.toJSON(),
  };
}
