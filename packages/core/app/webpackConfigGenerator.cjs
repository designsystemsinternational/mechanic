const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const { resolve } = require;

module.exports = function (
  modeParameter,
  { designFunctions, inputsData, appCompsPath, staticPath },
  distDir,
  publicPath
) {
  const mode = modeParameter === "dev" ? "development" : "production";
  const isProduction = mode === "production";

  const devtool = isProduction ? "source-map" : "eval-source-map";

  // condition function used to determine if a path belongs to mechanic or not

  const isMechanicCondition = pathname => {
    const isMechanic = /\/@mechanic-design\//.test(pathname);
    return isMechanic;
  };

  const isNotMechanicCondition = pathname => !isMechanicCondition(pathname);

  // this is necessary to load the assets (i.e. favicon) in the html template
  const template = {
    test: /\.html$/i,
    loader: "html-loader"
  };

  // https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
  const js = {
    test: /\.(js|jsx)$/,
    exclude: pathname => {
      return (
        pathname.includes("node_modules") &&
        !pathname.includes("@mechanic-design") &&
        !pathname.startsWith(__dirname)
      );
    },
    use: {
      loader: resolve("babel-loader"),
      options: {
        presets: [
          resolve("@babel/preset-react"),
          [
            resolve("@babel/preset-env"),
            {
              targets: {
                browsers: ["last 2 versions", "ie >= 11"]
              },
              modules: false
            }
          ]
        ],
        plugins: [resolve("react-hot-loader/babel"), resolve("@babel/plugin-transform-runtime")],
        env: {
          test: {
            presets: [resolve("@babel/preset-env")]
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

  const inputs = {
    test: /INPUTS/,
    use: [
      { loader: path.resolve(__dirname, "./input-loader.cjs"), options: { inputs: inputsData } }
    ]
  };

  const appComponents = {
    test: /APP/,
    use: [
      { loader: path.resolve(__dirname, "./app-components-loader.cjs"), options: { appCompsPath } }
    ]
  };

  const mechanicCss = {
    test: /\.(css)$/,
    issuer: isMechanicCondition,
    use: [isProduction ? MiniCssExtractPlugin.loader : resolve("style-loader")].concat([
      {
        loader: resolve("css-loader"),
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
        loader: resolve("postcss-loader"),
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [
              [
                resolve("postcss-preset-env"),
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
    issuer: isNotMechanicCondition,
    use: [
      resolve("style-loader"),
      {
        loader: resolve("css-loader"),
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
        loader: resolve("postcss-loader"),
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [
              [
                resolve("postcss-preset-env"),
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
    issuer: isMechanicCondition
  };

  const functionsFonts = {
    test: /\.(woff2?|otf|ttf)$/,
    type: "asset/inline",
    issuer: isNotMechanicCondition
  };

  const mechanicImages = {
    test: /\.(jpe?g|png|gif|svg)$/,
    type: "asset/resource",
    issuer: isMechanicCondition
  };

  const functionsImages = {
    test: /\.(jpe?g|png|gif|svg)$/,
    type: "asset/inline",
    issuer: isNotMechanicCondition
  };

  const entry = Object.entries(designFunctions).reduce(
    (acc, [name, designFunctionObj]) => {
      acc[name] = isProduction
        ? designFunctionObj.temp
        : [resolve("webpack-hot-middleware/client"), designFunctionObj.temp];
      return acc;
    },
    {
      app: isProduction
        ? path.resolve(__dirname, "./index.js")
        : [resolve("webpack-hot-middleware/client"), path.resolve(__dirname, "./index.js")]
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
    publicPath: publicPath !== null ? publicPath : "",
    filename: isProduction ? "[contenthash]-[name].js" : "[fullhash]-[name].js",
    chunkFilename: isProduction
      ? "[contenthash]-[name].[id].chunk.js"
      : "[fullhash]-[name].[id].chunk.js"
  };

  const plugins = [
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify(publicPath ? `${publicPath}` : "")
    }),
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

  if (staticPath) {
    new CopyPlugin({
      patterns: [{ from: staticPath, to: staticPath }]
    });
  }

  return {
    mode,
    devtool,
    entry,
    output,
    resolve: {
      extensions: [".js", ".jsx", ".json"],
      alias: {
        react: resolve("react"),
        "react-dom": resolve("react-dom")
      }
    },
    module: {
      rules: [
        template,
        js,
        functions,
        inputs,
        appComponents,
        mechanicCss,
        functionsCss,
        mechanicFonts,
        functionsFonts,
        mechanicImages,
        functionsImages
      ]
    },
    plugins
  };
};
