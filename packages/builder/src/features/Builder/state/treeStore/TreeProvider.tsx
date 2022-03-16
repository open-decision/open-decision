import * as React from "react";
import { suspend } from "suspend-react";
import { IndexeddbPersistence } from "y-indexeddb";
import { createTreeStore } from "./treeStore";

type ProviderProps = { children: React.ReactNode; id: string };

const Context = React.createContext<ReturnType<typeof createTreeStore> | null>(
  null
);

async function createDoc(id: string): Promise<any> {
  return new Promise((resolve) => {
    const treeStore = createTreeStore();

    const persistence = new IndexeddbPersistence(id, treeStore.yDoc);
    persistence.whenSynced.then(() => resolve(treeStore));
  });
}

export const TreeProvider = ({ children, id }: ProviderProps) => {
  const treeStore = suspend(() => createDoc(id), [id]);

  return <Context.Provider value={treeStore}>{children}</Context.Provider>;
};

export const useTree = () => {
  const treeStore = React.useContext(Context);

  if (!treeStore) {
    throw new Error(
      `A TreeProvider needs to be wrapped around the usage location of useTree`
    );
  }

  return treeStore;
};
