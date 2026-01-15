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
  const filename = searchParams.get("filename") || "download";

  if (!url || !isSafeUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok || !res.body) {
    return NextResponse.json({ error: "Failed to download" }, { status: 400 });
  }

  const len = res.headers.get("content-length");
  if (len && Number(len) > 250 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (limit 250MB)" }, { status: 413 });
  }

  const contentType = res.headers.get("content-type") || "application/octet-stream";

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
