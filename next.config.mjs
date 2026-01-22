/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // docs 폴더를 빌드에서 제외
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/docs/**', '**/node_modules/**'],
    };
    return config;
  },
  // TypeScript 빌드 시 docs 폴더 제외
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
  },
};

export default nextConfig;
