/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // The Google image domain
      },
      {
        protocol: "https",
        hostname: "adept-trout-844.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
