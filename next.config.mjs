/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prevent production builds from replacing chunks used by the dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};
export default nextConfig;
