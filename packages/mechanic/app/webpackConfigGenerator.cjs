const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = (modeParam, designFunctions, distDir) => {
  const mode = modeParam === "dev" ? "development" : "production";
  const isProduction = mode === "production";

  const devtool = isProduction ? "source-map" : "eval-source-map";

  // condition function used to determine if a path belongs to mechanic or not
  const isMechanicCondition = pathname => {
    const isMechanicModule = /node_modules.+mechanic/.test(pathname);
    // if (pathname) console.log(path.relative(process.cwd(), pathname), isMechanicModule);
    return isMechanicModule;
  };

  // https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
  const js = {
    test: /\.(js|jsx)$/,
    exclude: pathname => {
      return (
        pathname.includes("node_modules") &&
        !pathname.includes("@designsystemsinternational") &&
        !pathname.startsWith(__dirname)
      );
    },
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
              },
              modules: false
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

  const functions = {
    test: /FUNCTIONS/,
    use: [
      { loader: path.resolve(__dirname, "./function-loader.cjs"), options: { designFunctions } }
    ]
  };

  const mechanicCss = {
    test: /\.(css)$/,
    include: isMechanicCondition,
    use: [isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader")].concat([
      {
        loader: require.resolve("css-loader"),
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

  const functionsCss = {
    test: /\.(css)$/,
    exclude: isMechanicCondition,
    use: [
      require.resolve("style-loader"),
      {
        loader: require.resolve("css-loader"),
        options: {
          modules: {
            auto: true,
            localIdentName: "[path]--[name]__[local]",
            namedExport: true,
            exportLocalsConvention: "camelCaseOnly"
          },
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
    ]
  };

  const mechanicFonts = {
    test: /\.(woff2?|otf|ttf)$/,
    type: "asset/resource",
    include: isMechanicCondition
  };

  const functionsFonts = {
    test: /\.(woff2?|otf|ttf)$/,
    type: "asset/inline",
    exclude: isMechanicCondition
  };

  const entry = Object.entries(designFunctions).reduce(
    (acc, [name, designFunctionObj]) => {
      acc[name] = designFunctionObj.temp;
      return acc;
    },
    {
      app: isProduction
        ? path.resolve(__dirname, "./index.js")
        : [
            path.resolve(__dirname, "./index.js")
            // commented for now, seems to be issue in webpack5
            // require.resolve("webpack-hot-middleware/client")
          ]
    }
  );

  const outputPath = distDir
    ? path.resolve(process.cwd(), distDir)
    : path.join(process.cwd(), "dist");
  const output = {
    path: outputPath,
    library: {
      type: "umd"
    },
    publicPath: "/",
    filename: isProduction ? "[contenthash]-[name].js" : "[fullhash]-[name].js",
    chunkFilename: isProduction
      ? "[contenthash]-[name].[id].chunk.js"
      : "[fullhash]-[name].[id].chunk.js"
  };

  const plugins = [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": mode
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      chunks: ["app"]
    }),
    ...Object.keys(designFunctions).map(
      name =>
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "./index.html"),
          filename: `${name}.html`,
          chunks: [name]
        })
    ),
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
      extensions: [".js", ".jsx", ".json"],
      alias: {
        react: require.resolve("react"),
        "react-dom": require.resolve("react-dom")
      }
    },
    module: {
      rules: [js, functions, mechanicCss, functionsCss, mechanicFonts, functionsFonts]
    },
    plugins
  };
};
