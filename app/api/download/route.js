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

  // yt-dlp template
  const outputTemplate = path.join(
    tmpDir,
    "%(title).200s.%(ext)s"
  );

  const height = quality.replace("p", "");

  const args = [
    url,
    "-f",
    `bestvideo[ext=mp4][height<=${height}]+bestaudio[ext=m4a]/mp4`,
    "--merge-output-format",
    "mp4",
    "--no-playlist",
    "-o",
    outputTemplate,
  ];

  await new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", args);
    ytdlp.on("close", resolve);
    ytdlp.on("error", reject);
  });

  // หาไฟล์ที่ถูกสร้างจริง
  const files = fs.readdirSync(tmpDir);
  const file = files.find(f => f.endsWith(".mp4"));

  if (!file) {
    return new Response("File not found", { status: 500 });
  }

  const filePath = path.join(tmpDir, file);
  const buffer = fs.readFileSync(filePath);
  fs.unlinkSync(filePath);

  const encodedFilename = encodeURIComponent(file);

  return new Response(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
    },
  });
}
