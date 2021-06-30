const path = require("path");
const webpack = require("webpack");
const getPort = require("get-port");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = async (env, argv) => {
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
            localIdentName: "[name]__[local]"
          },
          localsConvention: "camelCase",
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
  const pbcopy = require("child_process").spawn("pbcopy");
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
      rules: [js, css]
    },
    plugins,
    devServer
  };
};
