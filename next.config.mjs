const nextConfig = { output: 'export', distDir: process.env.NODE_ENV === 'production' ? '.next-build' : '.next', images: { unoptimized: true } };
export default nextConfig;
