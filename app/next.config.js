/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,
      fs: false, // the solution
    };

    config.module.rules.push({
      test: /\.node/,
      use: "node-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
