import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isSafeUrl(raw) {
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || !isSafeUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let res;
  try {
    res = await fetch(url, { method: "HEAD", redirect: "follow" });
  } catch {
    return NextResponse.json({ error: "Cannot reach URL" }, { status: 400 });
  }

  // บาง server ไม่รองรับ HEAD
  if (!res.ok) {
    try {
      res = await fetch(url, { method: "GET", redirect: "follow" });
    } catch {
      return NextResponse.json({ error: "URL not accessible" }, { status: 400 });
    }
  }

  if (!res.ok) {
    return NextResponse.json({ error: "URL not accessible" }, { status: 400 });
  }

  const contentType = res.headers.get("content-type") || "unknown";
  const contentLength = res.headers.get("content-length");
  const size = contentLength ? Number(contentLength) : null;

  const disposition = res.headers.get("content-disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
  const filenameFromHeader = match?.[1] ? decodeURIComponent(match[1]) : null;

  const pathname = new URL(url).pathname;
  const filenameFromPath = pathname.split("/").filter(Boolean).pop() || "download";

  return NextResponse.json({
    url,
    filename: filenameFromHeader || filenameFromPath,
    contentType,
    size,
    canConvert: contentType.startsWith("video/") || contentType.startsWith("audio/"),
  });
}
