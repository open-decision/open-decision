import { proxy } from "valtio";
import { bind } from "valtio-yjs";
import * as Y from "yjs";
import { Tree } from "@open-decision/tree-type";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore(id: string) {
  const transactionOrigin = `valtio for ${id}`;

  const yDoc = new Y.Doc({ guid: id });
  const yMap = yDoc.getMap("tree");

  const undoManager = new Y.UndoManager(yMap, {
    trackedOrigins: new Set([transactionOrigin]),
  });

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

  bind(syncedStore, yMap, {
    transactionOrigin,
  });

  const tree = proxy({
    tree: syncedStore,
    supensionProxy,
    uuid: id,
  });

  return {
    tree,
    yDoc,
    onSync,
    undoManager,
  };
}
