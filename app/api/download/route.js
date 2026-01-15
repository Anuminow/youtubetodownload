import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import WebSocket from "ws";

const WS_URL = "wss://chidchanun.online/ws";

export async function POST(req) {
  const { url, quality } = await req.json();
  const height = quality.replace("p", "");

  const ws = new WebSocket(WS_URL);

  const tmp = os.tmpdir();
  const file = path.join(tmp, `video-${Date.now()}.mp4`);

  const args = [
    url,
    "-f",
    `bestvideo[height<=${height}]+bestaudio/best`,
    "--merge-output-format",
    "mp4",
    "--newline",
    "-o",
    file,
  ];

  await new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", args);

    ytdlp.stderr.on("data", (d) => {
      const match = d.toString().match(/(\d+(?:\.\d+)?)%/);
      if (match && ws.readyState === 1) {
        ws.send(JSON.stringify({ progress: match[1] }));
      }
    });

    ytdlp.on("close", resolve);
    ytdlp.on("error", reject);
  });

  ws.close();

  const buffer = fs.readFileSync(file);
  fs.unlinkSync(file);

  return new Response(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="video.mp4"`,
    },
  });
}
