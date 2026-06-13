import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    turbopack: {},
    allowedDevOrigins: ["103.165.209.246", "103.6.201.118"],
};

export default nextConfig;
