import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    SECRET_KEY: process.env.SECRET_KEY,
  }
};

export default nextConfig;
