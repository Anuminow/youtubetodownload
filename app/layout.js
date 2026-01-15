import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://chidchanun.online"),

  title: {
    default: "convertVideo | แปลงวิดีโอ & ดาวน์โหลด YouTube ออนไลน์",
    template: "%s | convertVideo",
  },

  description:
    "convertVideo เครื่องมือออนไลน์สำหรับแปลงไฟล์วิดีโอและเสียง เช่น MP4, MP3, WAV พร้อมดาวน์โหลดวิดีโอจาก YouTube ใช้งานง่าย รวดเร็ว ไม่ต้องติดตั้งโปรแกรม",

  keywords: [
    "แปลงวิดีโอ",
    "convert video",
    "youtube downloader",
    "download youtube",
    "mp3 converter",
    "mp4 converter",
    "video to mp3",
    "แปลงไฟล์ออนไลน์",
    "youtube mp3",
    "youtube mp4",
  ],

  authors: [{ name: "convertVideo" }],
  creator: "convertVideo",
  publisher: "convertVideo",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://chidchanun.online",
    siteName: "convertVideo",
    title: "convertVideo | แปลงวิดีโอ & ดาวน์โหลด YouTube",
    description:
      "แปลงวิดีโอและเสียงจาก YouTube เป็น MP3, MP4, WAV ได้ง่าย ๆ ดาวน์โหลดได้ทันทีผ่าน convertVideo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "convertVideo - Video Converter & YouTube Downloader",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "convertVideo | แปลงวิดีโอ & ดาวน์โหลด YouTube",
    description:
      "เครื่องมือแปลงไฟล์วิดีโอและดาวน์โหลด YouTube เป็น MP3 / MP4 ออนไลน์",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://chidchanun.online",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
