/** @type {import('next').NextConfig} */
import webpack from "webpack";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  
  reactStrictMode: true,
  logging: {
    incomingRequests: false,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "identicon.starknet.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.starkurabu.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:(.*)$/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );

    if (dev && !isServer) {
      config.infrastructureLogging = {
        level: "error",
      };
    }

    if (dev) {
      config.watchOptions = {
        poll: 1000, // check for changes every 1s
        aggregateTimeout: 300,
      };
    }

    return config;
  },
};

export default withPWA(nextConfig);
