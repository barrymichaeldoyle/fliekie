import { fileURLToPath } from "url";
import createJiti from "jiti";

createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  transpilePackages: [
    // uncomment these as we break into more packages
    // "@fliekie/api",
    // "@fliekie/auth",
    // "@fliekie/db",
    // "@fliekie/ui",
    // "@fliekie/validators",
  ],

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "image.tmdb.org" },
    ],
  },
};

export default config;
