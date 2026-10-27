const nextConfig = { output: 'export', trailingSlash: true, poweredByHeader: false, productionBrowserSourceMaps: false, distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next', images: { unoptimized: true } };
export default nextConfig;
