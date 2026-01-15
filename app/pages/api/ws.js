import { getWSServer } from "@/lib/ws-server";

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    res.socket.server.wss = getWSServer(res.socket.server);
  }
  res.end();
}
