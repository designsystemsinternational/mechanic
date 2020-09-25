const path = require("path");
const webpack = require("webpack");
const getPort = require("get-port");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = async (env, argv) => {
  const mode = argv.mode === "production" ? "production" : "development";
  const isProduction = mode === "production";

  const js = {
    test: /\.(jsx?)$/,
    use: ["babel-loader"],
    exclude: /.+\/node_modules\/.+/
  };

  const css = {
    test: /\.(css)$/,
    use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader"].concat([
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

  const optimization = isProduction
    ? {
        minimizer: [
          new TerserPlugin({
            parallel: true,
            sourceMap: true
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
      }
    : {};

  const plugins = [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": mode
    }),
    new HtmlWebPackPlugin({
      template: "./app/index.html",
      filename: "index.html",
      chunks: ["app"]
    })
  ].concat(
    isProduction
      ? [
          new CleanWebpackPlugin(),
          new MiniCssExtractPlugin({
            filename: "[name].css"
          })
        ]
      : [new webpack.HotModuleReplacementPlugin()]
  );

  const devServer = {
    port: process.env.PORT || (await getPort({ port: 3000 })),
    host: "0.0.0.0",
    disableHostCheck: true,
    historyApiFallback: true,
    hot: !isProduction
  };

  if (!isProduction) {
    const url = `http://${devServer.host}:${devServer.port}`;
    const pbcopy = require("child_process").spawn("pbcopy");
    pbcopy.stdin.write(url);
    pbcopy.stdin.end();
    console.log(`
******************************************
Copied "${url}" to clipboard.
******************************************
`);
  }

  let externals = {};
  if (isProduction) {
    // Don't bundle react or react-dom
    (externals.react = {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    }),
      (externals["react-dom"] = {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "ReactDOM",
        root: "ReactDOM"
      });
  }

  return {
    mode,
    devtool: isProduction ? "source-map" : "eval-source-map",
    entry: {
      mechanic: "./src/index.js",
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
    externals,
    module: {
      rules: [js, css]
    },
    optimization,
    plugins,
    devServer
  };
};
