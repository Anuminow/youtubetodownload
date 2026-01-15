import { spawn } from "child_process";

export async function POST(req) {
  const { url, quality } = await req.json();

  if (!url) {
    return new Response("Missing URL", { status: 400 });
  }

  const height = quality.replace("p", "");

  const args = [
    url,
    "-f",
    `bestvideo[ext=mp4][height<=${height}]+bestaudio[ext=m4a]/mp4`,
    "--merge-output-format",
    "mp4",
    "--newline", // สำคัญมาก
    "--no-playlist",
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const ytdlp = spawn("yt-dlp", args);

      ytdlp.stdout.on("data", (data) => {
        const text = data.toString();

        // ดึงเปอร์เซ็นต์ เช่น [download]  42.3%
        const match = text.match(/(\d+\.\d+)%/);
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
