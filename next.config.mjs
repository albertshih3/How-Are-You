/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Commented out static export to support Convex real-time queries and dashboard
  // output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
