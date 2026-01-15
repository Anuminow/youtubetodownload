import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

console.log("🟢 WebSocket running on ws://localhost:8081");

wss.on("connection", (ws) => {
  console.log("🟢 Client connected");

  ws.on("close", () => {
    console.log("🔴 Client disconnected");
  });
});

export function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(msg);
  });
}
