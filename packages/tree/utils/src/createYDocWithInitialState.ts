import * as Y from "yjs";
import { proxy } from "valtio";
import { bind } from "valtio-yjs";

export const createYDocWithInitialState = (state: any) => {
  const yDoc = new Y.Doc();

  const yMap = yDoc.getMap("tree");
  const store = proxy(state["treeData"]);

  bind(store, yMap);

  return yDoc;
};
