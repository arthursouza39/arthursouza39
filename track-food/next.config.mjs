/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Bucket público do Supabase Storage (fotos de cardápio/nota fiscal)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
