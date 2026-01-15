/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://10.0.0.3:3000",
    "http://10.0.0.3",
    "https://chidchanun.online",
    'local-origin.dev',
    '*.local-origin.dev'
  ],
};

export default nextConfig;