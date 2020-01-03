const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


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
        exclude: /(node_modules|bower_components|bundle|lib)/,
        loader: 'ts-loader',
      },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|bundle|lib)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
  ],
  externals: {
    'react': 'commonjs react'
  },
});

// Return Array of Configurations
module.exports = [ indexConfig ];
