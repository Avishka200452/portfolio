/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile three.js + React Three Fiber packages (ESM modules)
  transpilePackages: [
    'three',
    'meshline',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/rapier',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

module.exports = nextConfig;

