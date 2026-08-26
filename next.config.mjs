// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["img.clerk.com"], // ✅ allow Clerk images
//   },
// };

// export default nextConfig;

import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"], // ✅ allow Clerk images
  },
}

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disable in dev
}

export default withPWA(pwaConfig)(nextConfig)