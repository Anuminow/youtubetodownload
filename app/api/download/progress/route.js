import { spawn } from "child_process";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const quality = searchParams.get("quality") || "720p";

  const height = quality.replace("p", "");
  const encoder = new TextEncoder();

  const args = [
    url,
    "-f",
    `bestvideo[ext=mp4][height<=${height}]+bestaudio[ext=m4a]/mp4`,
    "--merge-output-format",
    "mp4",
    "--newline",
    "--no-playlist",
    "-o",
    "/dev/null",
  ];

  const stream = new ReadableStream({
    start(controller) {
      const ytdlp = spawn("yt-dlp", args);

      ytdlp.stdout.on("data", (data) => {
        const match = data.toString().match(/(\d+\.\d+)%/);
        if (match) {
          controller.enqueue(
            encoder.encode(`data: ${match[1]}\n\n`)
          );
        }
      });

      ytdlp.on("close", () => {
        controller.enqueue(encoder.encode("data: done\n\n"));
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
