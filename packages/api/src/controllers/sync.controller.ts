import { WebSocketServer } from "ws";
import catchAsync from "../utils/catchAsync";
import { wsAuth } from "./../middlewares/auth";
import { setupWSConnection } from "y-websocket/bin/utils";
import { setPersistence } from "y-websocket/bin/utils";
import { hasPermissionsForTree } from "src/services/permission.service";
import * as http from "http";
import * as net from "net";
import * as Y from "yjs";
import prisma from "src/init-prisma-client";
import * as buffer from "lib0/buffer";

export const wss = new WebSocketServer({
  noServer: true,
});

wss.on("connection", (websocket, request) =>
  setupWSConnection(websocket, request, {
    docName: getUuidFromRequest(request),
  })
);

export const websocketUpgradeHandler = catchAsync(
  async (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    console.log(request.url);
    wsAuth(request, async function next(err, client) {
      if (err || !client) {
        console.log(err);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
      if (!request.url!.startsWith("/v1/builder-sync/")) {
        socket.write("HTTP/1.1 404 Not found\r\n\r\n");
        socket.destroy();
        return;
      }

      if (!request.url) return;
      const treeUuid = getUuidFromRequest(request);

      if (!(await hasPermissionsForTree(client.uuid, treeUuid))) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
      });
    });
  }
);

export const setupSyncBindings = () => {
  setPersistence({
    bindState: async (docName, ydoc) => {
      console.log("Called bind state", docName);
      // const persistedYdoc = await ldb.getYDoc(docName);
      // Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      // ydoc.on("update", (update) => {
      //   ldb.storeUpdate(docName, update);
      // });
      const persistedDoc = await getYDocFromDatabase(docName); // retrieve the original Yjs doc here
      console.log(persistedDoc);
      if (persistedDoc) {
        Y.applyUpdate(ydoc, persistedDoc as any);
      }
    },
    writeState: async (docName, ydoc) => {
      console.log("Called write state", docName);
      await saveYDocToDatabase(docName, Y.encodeStateAsUpdate(ydoc));
    },
  });
};

const saveYDocToDatabase = async (docName: string, yData) => {
  await prisma.decisionTree.updateMany({
    where: {
      uuid: { equals: docName },
    },
    data: {
      yDocument: buffer.toBase64(yData),
    },
  });
};

const getYDocFromDatabase = async (docName: string) => {
  const data = await prisma.decisionTree.findFirst({
    where: {
      uuid: { equals: docName },
    },
  });

  if (!data?.yDocument) return false;
  return buffer.fromBase64(data.yDocument);
};

const getUuidFromRequest = (request: http.IncomingMessage) => {
  return new URL(
    request.url!,
    `http://${request.headers.host}`
  ).pathname.replace("/v1/builder-sync/", "");
};
