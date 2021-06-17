// https://webpack.js.org/guides/development/#using-webpack-dev-middleware
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();

const configGenerator = require("../app/webpackConfigGenerator");

const config = configGenerator("dev");
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});
