/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://10.0.0.3:3000",
      "https://chidchanun.online",
    ],
  },
};

export default nextConfig;