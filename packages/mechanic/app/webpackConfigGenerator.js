const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = mode => ({
  mode: mode === "dev" ? "development" : "production",
  devtool: mode ? "source-map" : "eval-source-map",
  entry: path.resolve(__dirname, "./src/index.js"),
  // Where files should be sent once they are bundled
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.bundle.js",
    publicPath: "/"
  },
  // Rules of how webpack will take our files, compile & bundle them for the browser
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /.+\/node_modules\/.+/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [require.resolve("@babel/preset-env"), require.resolve("@babel/preset-react")],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [require.resolve("style-loader"), require.resolve("css-loader")]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html")
    })
  ]
});
