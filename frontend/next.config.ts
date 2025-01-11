import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: 1000, // ตรวจสอบไฟล์ทุก 1 วินาที (optional)
      };
    }
    return config;
  },
};

export default nextConfig;
