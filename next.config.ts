import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dari network IP (untuk testing di HP/device lain)
  allowedDevOrigins: ["192.168.137.1"],
};

export default nextConfig;
