const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: "standalone",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  dirs: ["/app"], // 👈 tells Next where to look
};

module.exports = nextConfig;

