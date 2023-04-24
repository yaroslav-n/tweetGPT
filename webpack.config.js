const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    inject: "./src/inject/inject.ts",
    inject_tweetgpt_main: './src/inject/inject_tweetgpt_main.ts',
    inject_tweetgpt: './src/inject/inject_tweetgpt.ts',
    background: "./src/background/background.ts",
    popup: './src/popup/popup.ts',
    settings: './src/settings/settings.tsx',
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