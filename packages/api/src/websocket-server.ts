import { WebSocketServer, WebSocket } from "ws";
import { wsAuth } from "./middlewares/auth";
// import { setupWSConnection } from "./controllers/sync.controller";
import { setupWSConnection } from "y-websocket/bin/utils";
import * as http from "http";
import * as net from "net";
export const wss = new WebSocketServer({
  noServer: true,
});

// wss.on("connection", function connection(ws, request, client) {
//   console.log("Connected");
//   ws.on("message", function message(data) {
//     console.log(`Received message ${data} from user ${request.user.uuid}`);
//   });
// });

wss.on("connection", setupWSConnection);

export function websocketUpgradeHandler(
  request: http.IncomingMessage,
  socket: net.Socket,
  head: Buffer
) {
  console.log(request.url);
  wsAuth(request, function next(err, client) {
    if (err || !client) {
      console.log("Auth failed");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    if (!request.url!.startsWith("/v1/builder-sync/")) {
      socket.write("HTTP/1.1 404 Not found\r\n\r\n");
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
  });
}
