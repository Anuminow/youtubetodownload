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
  const baseName = `yt-${Date.now()}`;
  const outputTemplate = path.join(tmpDir, `${baseName}.mp4`);

  const height = quality?.replace("p", "") || "720";

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

  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", args);

    ytdlp.on("close", () => {
      if (!fs.existsSync(outputTemplate)) {
        return reject("MP4 file not found");
      }

      const buffer = fs.readFileSync(outputTemplate);
      fs.unlinkSync(outputTemplate);

      resolve(
        new Response(buffer, {
          headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="${baseName}.mp4"`,
          },
        })
      );
    });
  });
}
