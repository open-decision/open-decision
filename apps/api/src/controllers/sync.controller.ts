import { WebSocketServer } from "ws";
import { catchAsyncWebsocket } from "../utils/catchAsync";
import { wsAuth } from "../middlewares/auth";
import { setupWSConnection } from "y-websocket/bin/utils";
import { setPersistence } from "y-websocket/bin/utils";
import { hasPermissionsForTree } from "../services/permission.service";
import * as http from "http";
import * as Y from "yjs";
import prisma from "../init-prisma-client";
import { logger } from "../config/logger";
import { encodeYDoc, decodeYDoc } from "@open-decision/tree-utils";

export const wss = new WebSocketServer({
  noServer: true,
});

wss.on("connection", (websocket, request) => {
  return setupWSConnection(websocket, request, {
    docName: getUuidFromRequest(request),
  });
});

export const websocketUpgradeHandler = catchAsyncWebsocket(
  async (request, socket, head) => {
    wsAuth(request, async function next(err, client) {
      logger.info(
        `${socket.remoteAddress}:wss ${request.url?.split("?auth")[0]} upgrade`
      );

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
      const encodedYDoc = await getYDocFromDatabase(docName); // retrieve the original Yjs doc here
      if (encodedYDoc) {
        decodeYDoc(encodedYDoc, ydoc);
      }
    },
    writeState: async (docName, ydoc) => {
      await saveYDocToDatabase(docName, ydoc);
    },
  });
};

const saveYDocToDatabase = async (docName: string, yDoc: Y.Doc) => {
  const encodedYDocument = encodeYDoc(yDoc);

  await prisma.decisionTree.updateMany({
    where: {
      uuid: { equals: docName },
    },
    data: {
      yDocument: encodedYDocument,
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
  return data.yDocument;
};

const getUuidFromRequest = (request: http.IncomingMessage) => {
  if (!request.url) return undefined;

  return new URL(
    request.url,
    `http://${request.headers.host}`
  ).pathname.replace("/v1/builder-sync/", "");
};
