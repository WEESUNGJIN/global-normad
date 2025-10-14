// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import webpack from "webpack";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  staticDirs: ["../public"],
  framework: { name: "@storybook/react-webpack5", options: {} },

  webpackFinal: async (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      "@": path.resolve(__dirname, "../src"),
      "next/image": path.resolve(__dirname, "./mocks/NextImageMock.tsx"),
    };
    cfg.resolve.extensions = [
      ".ts", ".tsx", ".js", ".jsx", ".json",
      ...(cfg.resolve.extensions || []),
    ];
    cfg.resolve.fallback = {
      ...(cfg.resolve.fallback || {}),
      process: require.resolve("process/browser"),
    };

    if (!cfg.module) cfg.module = { rules: [] };
    if (!cfg.module.rules) cfg.module.rules = [];

    // TS/TSX
    cfg.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", { targets: "defaults" }],
            ["@babel/preset-react", { runtime: "automatic" }],
            ["@babel/preset-typescript", { allowDeclareFields: true }],
          ],
        },
      },
    });

    // CSS + PostCSS(Tailwind)
    cfg.module.rules = cfg.module.rules.filter(
      (r: any) => !(r?.test && r.test.toString().includes("css"))
    );
    cfg.module.rules.push({
      test: /\.css$/i,
      use: ["style-loader", { loader: "css-loader", options: { importLoaders: 1 } }, "postcss-loader"],
    });

    // ✅ SVG → 항상 SVGR 사용 + fill/stroke 제거 (currentColor로 제어)
    cfg.module.rules = cfg.module.rules.filter(
      (r: any) => !(r?.test && r.test.toString().includes("svg"))
    );
    cfg.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          svgo: true,
          svgoConfig: {
            plugins: [
              { name: "removeViewBox", active: false },
              { name: "removeDimensions", active: true },
              { name: "removeAttrs", params: { attrs: "(fill|stroke)" } }, // 👈 추가
            ],
          },
        },
      }],
    });

    // 기타 이미지
    cfg.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|ico)$/i,
      type: "asset/resource",
    });

    cfg.plugins = [
      ...(cfg.plugins || []),
      new webpack.ProvidePlugin({ process: "process/browser" }),
    ];

    return cfg;
  },
};

export default config;
