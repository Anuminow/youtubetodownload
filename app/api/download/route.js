import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req) {
  const { url, quality } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const tmpDir = os.tmpdir();
  const outputPath = path.join(tmpDir, `video-${Date.now()}.%(ext)s`);

  let args = [
    url,
    "-o",
    outputPath,
    "--no-playlist",
  ];

  // เลือกคุณภาพ
  if (quality === "audio") {
    args.push("-x", "--audio-format", "mp3");
  } else {
    args.push(
      "-f",
      `bestvideo[height<=${quality.replace("p","")}]+bestaudio/best`
    );
  }

  return new Promise((resolve) => {
    const ytdlp = spawn("yt-dlp", args);

    ytdlp.on("close", () => {
      const file = fs
        .readdirSync(tmpDir)
        .find(f => f.startsWith("video-"));

      const filePath = path.join(tmpDir, file);
      const buffer = fs.readFileSync(filePath);

      fs.unlinkSync(filePath);

      resolve(
        new Response(buffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${file}"`,
          },
        })
      );
    });
  });
}
