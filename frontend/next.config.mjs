
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const backendUrl = process.env.NEXT_SERVER_API_URL || 'http://127.0.0.1:8000';
const remotePatterns = [];

if (supabaseUrl) {
  const { protocol, hostname, port } = new URL(supabaseUrl);

  remotePatterns.push({
    protocol: protocol.replace(':', ''),
    hostname,
    port,
    pathname: '/storage/v1/object/public/**',
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns,
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          // Build-time destination. Set NEXT_SERVER_API_URL to the Render URL
          // in Vercel; local Docker keeps the localhost fallback.
          source: '/api/:path*',
          destination: `${backendUrl}/:path*`,
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
