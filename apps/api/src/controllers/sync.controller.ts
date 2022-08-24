import { WebSocketServer } from "ws";
import catchAsync from "../utils/catchAsync";
import { wsAuth } from "../middlewares/auth";
import { setupWSConnection } from "y-websocket/bin/utils";
import { setPersistence } from "y-websocket/bin/utils";
import { hasPermissionsForTree } from "../services/permission.service";
import * as http from "http";
import * as net from "net";
import * as Y from "yjs";
import prisma from "../init-prisma-client";
import buffer from "../utils/buffer";
import { logger } from "../config/logger";

export const wss = new WebSocketServer({
  noServer: true,
});

wss.on("connection", (websocket, request) => {
  return setupWSConnection(websocket, request, {
    docName: getUuidFromRequest(request),
  });
});

export const websocketUpgradeHandler = catchAsync(
  async (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    wsAuth(request, async function next(err, client) {
      logger.info(`${socket.remoteAddress}:wss ${request.url} upgrade`);

      if (!request.url?.startsWith("/v1/builder-sync/")) {
        socket.write("HTTP/1.1 404 Not found\r\n\r\n");
        logger.error(
          `${socket.remoteAddress}:wss ${request.url} Server only accepts websocket connections to /v1/builder-sync/`
        );
        socket.destroy();
        return;
      }

      if (err || !client) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        logger.error(
          `${socket.remoteAddress}:wss ${request.url} Unauthorized websocket connection`
        );
        socket.destroy();
        return;
      }

      const treeUuid = getUuidFromRequest(request);
      if (!treeUuid) return;

      if (!(await hasPermissionsForTree(client.uuid, treeUuid))) {
        socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
        logger.error(
          `${socket.remoteAddress}:wss ${request.url} User is not authorized to access this tree`
        );
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
        logger.info(`${socket.remoteAddress}:wss /v1/builder-sync connected`);
      });
    });
  }
);

export const setupSyncBindings = () => {
  setPersistence({
    bindState: async (docName, ydoc) => {
      // const persistedYdoc = await ldb.getYDoc(docName);
      // Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      // ydoc.on("update", (update) => {
      //   ldb.storeUpdate(docName, update);
      // });
      const persistedDoc = await getYDocFromDatabase(docName); // retrieve the original Yjs doc here
      if (persistedDoc) {
        Y.applyUpdate(ydoc, persistedDoc as any);
      }
    },
    writeState: async (docName, ydoc) => {
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
  if (!request.url) return undefined;

  return new URL(
    request.url,
    `http://${request.headers.host}`
  ).pathname.replace("/v1/builder-sync/", "");
};
