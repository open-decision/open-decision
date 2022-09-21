import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { bindProxyAndYMap } from "valtio-yjs";
import { proxy } from "valtio";

export function createYjsDocumentIndexedDB<
  TData extends Record<string, unknown>
>(data: TData, uuid: string): TData {
  const yDoc = new Y.Doc();
  new IndexeddbPersistence(uuid, yDoc);

  const yMap = yDoc.getMap("tree");
  const store = proxy(data);

  bindProxyAndYMap(store, yMap);

  return store;
}
