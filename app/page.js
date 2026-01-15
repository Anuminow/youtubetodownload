// app/page.js
'use client';

import { useState } from 'react';

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!url) {
      alert('Please enter a YouTube URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      let videoId = '';
      if (url.includes('youtube.com')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }

      setResult({
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        title: 'YouTube Video',
        quality: quality === 'audio' ? 'Audio Only (MP3)' : `${quality} HD`
      });
      setLoading(false);
    }, 2000);
  };

  const handleFinalDownload = () => {
    setProgress(0);
    setDownloading(true);

    const evt = new EventSource("/api/download");

    evt.onmessage = (e) => {
      if (e.data === "done") {
        evt.close();
        setProgress(100);
        setDownloading(false);
      } else {
        setProgress(parseFloat(e.data));
      }
    };
  };




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-indigo-600">
              VideoDownloader
            </div>
            <ul className="hidden md:flex space-x-8">
              <li>
                <a href="#home" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#tools" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                  Tools
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium transition">
                  About
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I download YouTube videos?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Copy the YouTube URL, paste it into the downloader, choose quality, and click Download.",
                },
              },
              {
                "@type": "Question",
                name: "Is this YouTube video downloader free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes, the downloader allows free downloads with daily limits.",
                },
              },
            ],
          }),
        }}
      />

      <main>
        {/* Hero Section */}
        <section className="text-center py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* User Avatars */}
            <div className="flex justify-center mb-4">
              <div className="flex -space-x-2">
                <img
                  src="https://i.pravatar.cc/150?img=1"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/150?img=2"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/150?img=3"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/150?img=4"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
            </div>

            <div className="inline-block bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 mb-4">
              Used by 100,000+ people every month
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Download YouTube videos in HD quality
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Save YouTube videos in high quality MP4 format. Fast, free, and works on all devices. No login or app required.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                10 Free/Day
              </span>
              <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                Safe & Secure
              </span>
              <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                HD Quality
              </span>
              <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                Updated: January 2026
              </span>
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
            {/* URL Input */}
            <div className="mb-8">
              <label htmlFor="videoUrl" className="block text-gray-900 font-semibold mb-2">
                YouTube Video URL
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="url"
                  aria-label="Video or file URL"
                  aria-describedby="url-help"
                  inputMode='url'
                  id="videoUrl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                />
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 cursor-pointer bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition whitespace-nowrap"
                >
                  Download
                </button>
              </div>
              <div
                id="url-help"
                className="flex items-center gap-2 text-gray-500 text-sm mt-2"
              >
                <span aria-hidden="true">💡</span>
                <span>Paste any YouTube video URL to download</span>
              </div>
            </div>

            {/* Quality Selector */}
            <div className="mb-8">
              <label htmlFor="quality" className="block text-gray-900 font-semibold mb-2">
                Video Quality
              </label>
              <select
                id="quality"
                value={quality}
                aria-label="Select video download quality"
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer focus:border-indigo-500 focus:outline-none transition"
              >
                <option value="1080p">1080p - Full HD</option>
                <option value="720p">720p - HD (Recommended)</option>
                <option value="480p">480p - SD</option>
                <option value="240p">240p - Low</option>
                <option value="144p">144p - Very Low</option>
                <option value="audio">Audio Only - MP3</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                className="text-center py-8"
                aria-live="polite"
                aria-busy="true"
              >
                <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Processing your video...</p>
              </div>
            )}

            {/* Result Box */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              {!result ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Video Ready Below 👇
                  </h3>
                  <p className="text-gray-500">Your downloaded video will appear here</p>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="max-w-md mx-auto mb-4">
                    <img
                      src={result.thumbnail}
                      alt={`Thumbnail of ${result.title}`}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 mb-4">Quality: {result.quality}</p>
                  <button
                    aria-label="Start downloading YouTube video"
                    onClick={handleFinalDownload}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Download Now
                  </button>
                  {downloading && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Downloading...</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How to Download YouTube Videos in 3 Steps
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            Our YouTube video downloader makes it incredibly easy to save your favorite content
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Copy YouTube URL
              </h3>
              <p className="text-gray-600">
                Open YouTube and find the video you want to download. Click the Share button below the video and select "Copy link" to copy the YouTube URL to your clipboard.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Paste URL Here
              </h3>
              <p className="text-gray-600">
                Paste the YouTube URL into our YouTube video downloader tool above. Click the "Paste" button or press Ctrl+V (Cmd+V on Mac) to paste the link.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Download Your Video
              </h3>
              <p className="text-gray-600">
                Click the "Download" button and wait for processing. Our YouTube video downloader will fetch the video and save it in HD quality to your device.
              </p>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Use Our YouTube Video Downloader?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Download YouTube videos in seconds. Our YouTube video downloader is optimized for speed with real-time progress updates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                HD Quality
              </h3>
              <p className="text-gray-600">
                Download YouTube videos in the highest quality available. Get crisp, clear videos in 720p or 1080p MP4 format.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Works on All Devices
              </h3>
              <p className="text-gray-600">
                Use our YouTube video downloader on iPhone, Android, desktop, or tablet. No app installation needed—works in any browser.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Your privacy matters. We don't store your data or downloaded videos. Everything is processed securely.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I download YouTube videos?
                </h3>
                <p className="text-gray-600">
                  To download YouTube videos, simply copy the video URL from YouTube, paste it into our YouTube video downloader tool, and click Download. Our tool saves videos in high quality MP4 format. No login or app installation required.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is this YouTube video downloader free?
                </h3>
                <p className="text-gray-600">
                  Yes! Our YouTube video downloader offers 10 free downloads per day. You can upgrade to premium for unlimited downloads without any restrictions.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What video quality can I download?
                </h3>
                <p className="text-gray-600">
                  Our YouTube video downloader saves videos in the best available quality, typically HD (720p or 1080p) depending on the original video quality on YouTube.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do I need to install an app to download YouTube videos?
                </h3>
                <p className="text-gray-600">
                  No! Our YouTube video downloader is web-based and works directly in your browser. No app installation needed. Works on desktop, mobile, iPhone, Android, and all devices.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is it safe to download YouTube videos?
                </h3>
                <p className="text-gray-600">
                  Yes, our YouTube video downloader is completely safe and secure. We don't store your data or downloaded content. All downloads are processed securely. Please respect copyright and only download content you have permission to use.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2026 VideoDownloader. All rights reserved.</p>
          <p className="text-gray-400 text-sm">Terms of Service • Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}