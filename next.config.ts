import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // 旧搜索页（开发期遗留）→ 产品目录页；query 参数自动保留
        source: "/search-test",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
