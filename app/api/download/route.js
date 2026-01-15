import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req) {
  const { url, quality } = await req.json();

  if (!url) {
    return new Response("Missing URL", { status: 400 });
  }

  const tmpDir = os.tmpdir();
  const filename = `video-${Date.now()}.mp4`;
  const filePath = path.join(tmpDir, filename);
  const height = quality.replace("p", "");

  const args = [
    url,
    "-f",
    `bestvideo[ext=mp4][height<=${height}]+bestaudio[ext=m4a]/mp4`,
    "--merge-output-format",
    "mp4",
    "--no-playlist",
    "-o",
    filePath,
  ];

  await new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", args);
    ytdlp.on("close", resolve);
    ytdlp.on("error", reject);
  });

  const buffer = fs.readFileSync(filePath);
  fs.unlinkSync(filePath);

  return new Response(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
