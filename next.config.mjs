/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 très important pour Prisma + Next.js (server components)
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Inclure les fichiers générés par Prisma pour le build serveur
  outputFileTracingIncludes: {
    // On couvre aussi "app/**" pour éviter les erreurs dans les Server Components
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
