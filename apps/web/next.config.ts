import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(appRoot, "../..");

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "studentide.com",
      },
    ],
  },
  turbopack: {
    root: workspaceRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
