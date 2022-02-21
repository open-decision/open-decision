import { WebSocketServer } from "ws";
import { wsAuth } from "./middlewares/auth";
import { setupWSConnection } from "./controllers/sync.controller";

export const wss = new WebSocketServer({
  noServer: true,
  path: "/v1/builder-sync",
});

// wss.on("connection", function connection(ws, request, client) {
//   ws.on("message", function message(data) {
//     console.log(`Received message ${data} from user ${request.user.uuid}`);
//   });
// });

wss.on("connection", setupWSConnection);

export function websocketUpgradeHandler(request, socket, head) {
  wsAuth(request, function next(err, client) {
    if (err || !client) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
  });
}
