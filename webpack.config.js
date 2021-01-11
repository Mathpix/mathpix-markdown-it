const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // TODO: Add common Configuration
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};

const indexConfig = Object.assign({}, config, {
  entry: ["@babel/polyfill", path.join(__dirname, './src/index.tsx')],
  output: {
    path: path.resolve(__dirname, './es5/'),
    filename: `index.js`,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(examples|node_modules|bower_components|bundle|lib)/,
        loader: 'ts-loader',
      },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(examples|node_modules|bower_components|bundle|lib)\/(?![domino])/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /examples|node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  externals: {
    'react': 'commonjs react'
  },
});

// Return Array of Configurations
module.exports = [ indexConfig ];
