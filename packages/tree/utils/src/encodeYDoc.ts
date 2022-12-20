import * as Y from "yjs";
import buffer from "./buffer";

export const encodeYDoc = (yDoc: Y.Doc): string => {
  return buffer.toBase64(Y.encodeStateAsUpdate(yDoc));
};

export const decodeYDoc = (encodedYDoc: string, yDoc?: Y.Doc): Y.Doc => {
  const innerYDoc = yDoc ?? new Y.Doc();

  Y.applyUpdate(innerYDoc, buffer.fromBase64(encodedYDoc));

  return innerYDoc;
};
