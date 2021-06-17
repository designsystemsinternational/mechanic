// https://webpack.js.org/api/node/
const webpack = require("webpack");

const configGenerator = require("../app/webpackConfigGenerator");

const config = configGenerator("prod");

const compiler = webpack(
  config // [Configuration Object](/configuration/)
);

compiler.run((err, stats) => {
  // [Stats Object](#stats-object) https://webpack.js.org/api/node/#stats-object
  if (err || stats.hasErrors()) {
    // [Handle errors here](#error-handling)
    console.log("Error!");
    if (err) console.log(err);
    else
      console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true // Shows colors in the console
        })
      );
  }

  compiler.close(closeErr => {
    // ...
  });
});
