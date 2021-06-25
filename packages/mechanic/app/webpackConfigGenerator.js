const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = (modeParam, functionsPath) => {
  const mode = modeParam === "dev" ? "development" : "production";
  const isProduction = mode === "production";

  const devtool = isProduction ? "source-map" : "eval-source-map";

  // https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
  const js = {
    test: /\.(js|jsx)$/,
    exclude: /.+\/node_modules\/.+/,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        presets: [
          require.resolve("@babel/preset-react"),
          [
            require.resolve("@babel/preset-env"),
            {
              targets: {
                browsers: ["last 2 versions", "ie >= 11"]
              }
            }
          ]
        ],
        plugins: [
          require.resolve("react-hot-loader/babel"),
          require.resolve("@babel/plugin-transform-runtime")
        ],
        env: {
          test: {
            presets: [require.resolve("@babel/preset-env")]
          }
        }
      }
    }
  };

  const externalCss = {
    test: /\.(css)$/,
    include: [/.+\/node_modules\/.+/, /.+\/mechanic-ui-components\/.+/],
    use: [isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader")].concat([
      {
        loader: require.resolve("css-loader"),
        options: {
          modules: false,
          importLoaders: 1
        }
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [
              [
                require.resolve("postcss-preset-env"),
                {
                  stage: 0
                }
              ]
            ]
          }
        }
      }
    ])
  };

  const css = {
    test: /\.(css)$/,
    exclude: [/.+\/node_modules\/.+/, /.+\/mechanic-ui-components\/.+/],
    use: [isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader")].concat([
      {
        loader: require.resolve("css-loader"),
        options: {
          modules: {
            localIdentName: "[name]__[local]"
          },
          localsConvention: "camelCase",
          importLoaders: 1
        }
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [
              [
                require.resolve("postcss-preset-env"),
                {
                  stage: 0
                }
              ]
            ]
          }
        }
      }
    ])
  };

  const functions = {
    test: /FUNCTIONS/,
    use: [
      { loader: path.resolve(__dirname, "../src/function-loader.js"), options: { functionsPath } }
    ]
  };

  const entry = {
    app: path.resolve(__dirname, "./index.js"),
    functions: path.resolve(__dirname, "./functions.js")
  };
  const output = {
    path: path.join(process.cwd(), "dist"),
    libraryTarget: "umd",
    publicPath: "/",
    filename: isProduction ? "[contenthash]-[name].js" : "[fullhash]-[name].js",
    chunkFilename: isProduction
      ? "[contenthash]-[name].[id].chunk.js"
      : "[fullhash]-[name].[id].chunk.js"
  };

  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      chunks: ["app"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "functions.html",
      chunks: ["functions"]
    }),
    new NodePolyfillPlugin()
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

  return {
    mode,
    devtool,
    entry,
    output,
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },
    module: {
      rules: [js, css, externalCss, functions]
    },
    plugins
  };
};
