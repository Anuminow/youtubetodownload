import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          404
        </h1>

        <p className="mt-6 text-xl font-semibold">
          ไม่พบหน้าที่คุณต้องการ
        </p>

        <p className="mt-2 text-gray-400">
          อาจจะพิมพ์ URL ผิด หรือหน้านี้ถูกลบไปแล้ว
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            กลับหน้าแรก
          </Link>

          {/* <Link
            href="/convert-url"
            className="px-6 py-3 rounded-xl border border-gray-600 hover:bg-gray-800 transition"
          >
            ไปหน้าแปลง URL
          </Link> */}
        </div>
      </div>
    </div>
  )
}
