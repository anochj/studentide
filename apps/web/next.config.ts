import path from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const appRoot = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.join(appRoot, "../..")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "studentide.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "wsgejjkysw9dngbl.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: workspaceRoot,
  },
  outputFileTracingRoot: workspaceRoot,
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig