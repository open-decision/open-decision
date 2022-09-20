import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { proxy } from "valtio";

export function createYjsDocumentIndexedDB(data: any, uuid: string) {
  const yDoc = new Y.Doc();
  new IndexeddbPersistence(uuid, yDoc);

  const yMap = yDoc.getMap("tree");
  const store = proxy(data);

  return [store, yMap];
}
