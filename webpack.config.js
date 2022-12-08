const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    inject: "./src/inject/inject.ts",
    inject_openai: './src/inject/inject_openai.ts',
    background: "./src/background/background.ts",
  },
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};