import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: [
    "https://lint-imminent-swapping.ngrok-free.dev",
  ],
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
