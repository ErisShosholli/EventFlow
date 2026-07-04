import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones/other devices on the LAN to load dev resources (HMR etc.)
  // when browsing via the network URL instead of localhost.
  allowedDevOrigins: ["192.168.1.10"],
};

export default nextConfig;
