// next.config.js
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Only run the plugin client side
    if (!isServer) {
      config.plugins.push(new MonacoWebpackPlugin());
    }

    return config;
  },
};

export default nextConfig;
