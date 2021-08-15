import path, { dirname } from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import getPort from "get-port";
import { spawn } from "child_process";

import HtmlWebPackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (env, argv) => {
  const mode = "development";
  const js = {
    test: /\.(jsx?)$/,
    use: ["babel-loader"],
    exclude: /.+\/node_modules\/.+/
  };

  const css = {
    test: /\.(css)$/,
    use: ["style-loader"].concat([
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[name]__[local]",
            namedExport: true,
            exportLocalsConvention: "camelCaseOnly"
          },
          importLoaders: 1
        }
      },
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true
        }
      }
    ])
  };

  const files = {
    test: /(woff2?|otf|ttf)$/,
    type: "asset/resource"
  };

  const plugins = [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": mode
    }),
    new HtmlWebPackPlugin({
      template: "./app/index.html",
      filename: "index.html",
      chunks: ["app"]
    }),
    new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ];

  const devServer = {
    port: process.env.PORT || (await getPort({ port: 3000 })),
    host: "0.0.0.0",
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true
  };

  const url = `http://${devServer.host}:${devServer.port}`;

  const pbcopy = spawn("pbcopy");
  pbcopy.stdin.write(url);
  pbcopy.stdin.end();
  console.log(`
******************************************
Copied "${url}" to clipboard.
******************************************
`);

  return {
    mode,
    devtool: "eval-source-map",
    entry: {
      app: "./app/index.js"
    },
    output: {
      path: path.join(__dirname, "dist"),
      libraryTarget: "umd",
      publicPath: "/",
      filename: "[name].js"
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    module: {
      rules: [js, css, files]
    },
    plugins,
    devServer
  };
};
