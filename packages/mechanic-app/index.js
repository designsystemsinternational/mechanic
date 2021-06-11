const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const path = require("path");
const getPort = require("get-port");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// const { enableDevFeatures, mode } = require("./env");

// const appDirectory = path.resolve(__dirname, "app");

const getWebpackConfig = (functionsPath = "") => {
  return async (env, argv) => {
    const mode = argv.mode === "production" ? "production" : "development";
    const isProduction = mode === "production";

    const js = {
      test: /\.(jsx?)$/,
      use: ["babel-loader"],
      exclude: /.+\/node_modules\/.+/
    };

    const externalCss = {
      test: /\.(css)$/,
      include: [/.+\/node_modules\/.+/, /.+\/mechanic-ui-components\/.+/],
      use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader"].concat([
        {
          loader: "css-loader",
          options: {
            modules: false,
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

    const css = {
      test: /\.(css)$/,
      exclude: [/.+\/node_modules\/.+/, /.+\/mechanic-ui-components\/.+/],
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
        template: path.join(__dirname, "app", "index.html"),
        chunks: ["app"]
      }),
      new HtmlWebPackPlugin({
        template: path.join(__dirname, "app", "index.html"),
        filename: "functions.html",
        chunks: ["functions"]
      })
    ].concat(
      isProduction
        ? [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
              filename: "[contenthash]-[name].css"
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

    return {
      mode,
      devtool: isProduction ? "source-map" : "eval-source-map",
      entry: {
        app: path.join(__dirname, "app", "index.js"),
        functions: functionsPath || path.join(__dirname, "functions", "index.js")
      },
      output: {
        path: path.join(__dirname, "dist"),
        libraryTarget: "umd",
        publicPath: "/",
        filename: isProduction ? "[contenthash]-[name].js" : "[hash]-[name].js",
        chunkFilename: isProduction
          ? "[contenthash]-[name].[id].chunk.js"
          : "[hash]-[name].[id].chunk.js"
      },
      resolve: {
        extensions: [".js", ".jsx", ".json"]
      },
      module: {
        rules: [js, css, externalCss]
      },
      optimization,
      plugins,
      devServer
    };
  };
};

module.exports = {
  getWebpackConfig,
  async createMiddleware(functionsPath) {
    const app = express.Router();
    const webpackMiddlewareConfig = {
      publicPath: "",
      stats: "none",
      logLevel: "error"
    };
    const webpackHotMiddlewareConfig = { log: null };
    const secureCompiler = webpack(await getWebpackConfig(functionsPath)({}, {}));

    const middlewares = [
      webpackDevMiddleware(secureCompiler, webpackMiddlewareConfig),
      webpackHotMiddleware(secureCompiler, webpackHotMiddlewareConfig)
    ];
    for (const pair of middlewares) {
      const middleware = (req, res, next) => pair(req, res, next);
      app.use("/", middleware);
    }
    return app;
  }
};
