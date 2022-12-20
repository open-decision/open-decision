import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { bind } from "valtio-yjs";
import { proxy } from "valtio";

export function createYjsDocumentIndexedDB<
  TData extends Record<string, unknown>
>(data: TData, uuid: string): TData {
  const yDoc = new Y.Doc();

  const yMap = yDoc.getMap("tree");
  const store = proxy(data);

  bind(store, yMap);

  new IndexeddbPersistence(uuid, yDoc);

  return store;
}
