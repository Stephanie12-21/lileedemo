/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],

  outputFileTracingIncludes: {
    "app/**": ["./generated/prisma/**/*"],
    "src/app/**": ["./generated/prisma/**/*"],
    "api/**": ["./generated/prisma/**/*"],
    "src/app/api/**": ["./generated/prisma/**/*"],
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
