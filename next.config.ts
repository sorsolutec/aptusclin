import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
