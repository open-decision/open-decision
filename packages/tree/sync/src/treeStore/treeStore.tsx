import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import * as Y from "yjs";
import { Tree } from "@open-decision/tree-type";

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

  const supensionProxy = proxy({
    synced: new Promise((r) => {
      if (typeof window === "undefined") return r(true);
      onSync = r;
    }),
  });

  bindProxyAndYMap(syncedStore, yMap, {
    transactionOrigin: `valtio for ${id}`,
  });

  const tree = proxy({
    tree: syncedStore,
    supensionProxy,
  });

  return {
    tree,
    yDoc,
    onSync,
  };
}
