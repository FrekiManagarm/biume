import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  images: {
    remotePatterns: [
      {
        hostname: "sea1.ingest.uploadthing.com",
        protocol: "https",
      },
      {
        hostname: "i.imgur.com",
        protocol: "https",
      },
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "rkbf21yk4m.ufs.sh",
        protocol: "https",
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
