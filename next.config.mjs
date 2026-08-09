/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"], // ✅ allow Clerk images
  },
};

export default nextConfig;
