import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { bindProxyAndYMap } from "valtio-yjs";
import { proxy } from "valtio";

export function createYjsDocumentIndexedDB(data: any, uuid: string) {
  const yDoc = new Y.Doc();
  new IndexeddbPersistence(uuid, yDoc);

  const yMap = yDoc.getMap("tree");
  const store = proxy(data);

  bindProxyAndYMap(store, yMap);

  return store;
}
