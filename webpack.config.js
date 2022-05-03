const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/app/index.ts",
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(frag|vert|geom)$/,
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
        { from: "./src/gl/glsl", to: path.join(dist, "glsl") },
      ],
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};
