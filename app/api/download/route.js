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
  const baseName = `yt-${Date.now()}`;
  const outputTemplate = path.join(tmpDir, `${baseName}.%(ext)s`);

  let args = [
    url,
    "-o",
    outputTemplate,
    "--no-playlist",
  ];

  let isAudio = false;

  if (quality === "audio") {
    isAudio = true;
    args.push(
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "192K"
    );
  } else {
    args.push(
      "-f",
      `bestvideo[height<=${quality.replace("p", "")}]+bestaudio/best`
    );
  }

  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", args);

    ytdlp.on("close", () => {
      const files = fs.readdirSync(tmpDir);
      const file = files.find(f =>
        f.startsWith(baseName) &&
        (isAudio ? f.endsWith(".mp3") : true)
      );

      if (!file) {
        return reject("File not found");
      }

      const filePath = path.join(tmpDir, file);
      const buffer = fs.readFileSync(filePath);

      fs.unlinkSync(filePath);

      resolve(
        new Response(buffer, {
          headers: {
            "Content-Type": isAudio ? "audio/mpeg" : "application/octet-stream",
            "Content-Disposition": `attachment; filename="${file}"`,
          },
        })
      );
    });
  });
}
