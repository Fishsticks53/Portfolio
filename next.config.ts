import type { NextConfig } from "next";

// GitHub Pages serves a project site under /<repo>. CI sets BASE_PATH=/Portfolio;
// leave it unset for local dev or for a custom domain.
const basePath = process.env.BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
