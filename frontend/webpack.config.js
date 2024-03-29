const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Add this test for CSS files
        use: ["style-loader", "css-loader"], // Use these loaders for CSS files
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("development"), //NOTE: HARDCODED development here to get `npm run dev` to work
      },
    }),
    new webpack.DefinePlugin({
      // __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
    }),
  ],
};
