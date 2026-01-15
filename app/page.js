"use client";

import { useState } from "react";

const formats = [
  { value: "mp3", label: "MP3", hint: "Audio • 192kbps" },
  { value: "m4a", label: "M4A", hint: "Audio • AAC" },
  { value: "wav", label: "WAV", hint: "Audio • Lossless" },
  { value: "mp4", label: "MP4", hint: "Video • H.264 + AAC" },
];

function prettySize(bytes) {
  if (!bytes && bytes !== 0) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

export default function Page() {
  const [url, setUrl] = useState("");
  const [meta, setMeta] = useState(null);
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchMeta = async () => {
    setError("");
    setMeta(null);

    if (!url.trim()) {
      setError("กรุณาวางลิงก์ไฟล์ก่อน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setMeta(data);
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const directDownload = () => {
    if (!meta?.url) return;
    const dl = `/api/download?url=${encodeURIComponent(meta.url)}&filename=${encodeURIComponent(meta.filename)}`;
    window.location.href = dl;
  };

  const convertAndDownload = async () => {
    if (!meta?.url) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/convert-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: meta.url, format }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Convert failed");
      }

      const blob = await res.blob();
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = `converted.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(u);
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Link Downloader</h1>
            <p className="mt-2 text-sm text-white/70">
              วางลิงก์ไฟล์ → ดาวน์โหลดได้ทันที และถ้าเป็นมีเดียสามารถแปลงไฟล์ได้
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur">
            Next.js • JavaScript • Tailwind
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="วางลิงก์ไฟล์ เช่น https://.../video.mp4"
              className="w-full flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-white/20"
            />
            <button
              onClick={fetchMeta}
              disabled={loading}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 disabled:opacity-60"
            >
              {loading ? "กำลังตรวจสอบ..." : "Get file"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {meta && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm text-white/60">Filename</div>
                  <div className="mt-1 text-lg font-bold break-all">{meta.filename}</div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/70">
                    <div>
                      <span className="text-white/50">Type: </span>
                      {meta.contentType}
                    </div>
                    <div>
                      <span className="text-white/50">Size: </span>
                      {prettySize(meta.size)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-[260px]">
                  <button
                    onClick={directDownload}
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                  >
                    Direct Download
                  </button>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-sm font-semibold">Convert & Download</div>

                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="mt-2 w-full rounded-xl bg-black/60 px-3 py-2 text-sm outline-none ring-1 ring-white/10 hover:ring-white/20"
                      disabled={!meta.canConvert}
                    >
                      {formats.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label} — {f.hint}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={convertAndDownload}
                      disabled={busy || !meta.canConvert}
                      className="mt-3 w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-50"
                    >
                      {busy ? "กำลังแปลง..." : meta.canConvert ? "Convert" : "ไฟล์นี้แปลงไม่ได้"}
                    </button>

                    <p className="mt-2 text-xs text-white/45">
                      แปลงได้เฉพาะไฟล์ audio/video ตาม Content-Type
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-5 text-xs text-white/45">
            ถ้าจะใช้จริง แนะนำเพิ่มการป้องกัน SSRF + จำกัดโดเมนที่อนุญาต
          </p>
        </div>
      </div>
    </main>
  );
}
