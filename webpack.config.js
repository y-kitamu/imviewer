const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(frag|vert)$/,
        type: "asset/source",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: dist,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./static/index.html", to: dist },
        /* { from: "./static/", to: path.join(dist, "static") }, */
      ],
    }),
  ],
};
