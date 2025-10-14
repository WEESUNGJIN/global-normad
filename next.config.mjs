/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,
              svgoConfig: {
                plugins: [
                  { name: "removeViewBox", active: false },
                  { name: "removeDimensions", active: true },
                  // 아이콘 내부 고정 색 제거 → currentColor로 Tailwind/text-색으로 제어
                  { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
                ],
              },
            },
          },
        ],
      });
      return config;
    },
  };
  
  export default nextConfig;
  