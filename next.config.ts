import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/en/Info-gates/omanchamber/registration",
        destination: "/en/registration/osus",
        permanent: true,
      },
      {
        source: "/ar/Info-gates/omanchamber/registration",
        destination: "/ar/registration/osus",
        permanent: true,
      },
      {
        source: "/en/registration",
        destination: "/en/registration/osus",
        permanent: true,
      },
      {
        source: "/ar/registration",
        destination: "/ar/registration/osus",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@react-three/drei", "@react-three/fiber", "three"],
  },
};

export default withNextIntl(nextConfig);
