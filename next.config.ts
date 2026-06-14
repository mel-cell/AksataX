import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    turbopack: {},
    allowedDevOrigins: ["103.165.209.246", "103.6.201.118", "192.168.3.103"],
};

export default nextConfig;
