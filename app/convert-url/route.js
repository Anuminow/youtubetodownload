import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

ffmpeg.setFfmpegPath(ffmpegPath);

function isSafeUrl(raw) {
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

function getOutputConfig(format) {
  switch (format) {
    case "mp3":
      return { ext: "mp3", mime: "audio/mpeg", args: ["-vn", "-b:a", "192k"] };
    case "wav":
      return { ext: "wav", mime: "audio/wav", args: ["-vn"] };
    case "m4a":
      return { ext: "m4a", mime: "audio/mp4", args: ["-vn", "-c:a", "aac", "-b:a", "192k"] };
    case "mp4":
      return {
        ext: "mp4",
        mime: "video/mp4",
        args: ["-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-b:a", "160k"],
      };
    default:
      return null;
  }
}

function runFfmpeg(inputPath, outputPath, args) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(args)
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const url = body?.url;
    const format = body?.format;

    if (!url || !isSafeUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cfg = getOutputConfig(format);
    if (!cfg) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // ตรวจขนาดก่อน (กันไฟล์ใหญ่เกิน)
    const head = await fetch(url, { method: "HEAD", redirect: "follow" });
    const len = head.headers.get("content-length");
    if (len && Number(len) > 250 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (limit 250MB)" }, { status: 413 });
    }

    const tmpDir = path.join(process.cwd(), ".tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    const id = randomUUID();
    const inputPath = path.join(tmpDir, `${id}-input`);
    const outputPath = path.join(tmpDir, `${id}-output.${cfg.ext}`);

    // ดาวน์โหลดไฟล์ลง temp
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return NextResponse.json({ error: "Cannot fetch file" }, { status: 400 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(inputPath, buf);

    // แปลง
    await runFfmpeg(inputPath, outputPath, cfg.args);

    // ส่งกลับให้ดาวน์โหลด
    const outBuf = await fs.readFile(outputPath);

    // ลบ temp
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);

    return new NextResponse(outBuf, {
      status: 200,
      headers: {
        "Content-Type": cfg.mime,
        "Content-Disposition": `attachment; filename="converted.${cfg.ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Convert failed", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
