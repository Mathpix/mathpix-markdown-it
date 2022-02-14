const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");


const config = {

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};

const indexConfig = Object.assign({}, config, {
  entry: [ path.join(__dirname, './src/index.tsx')],

  devtool: 'source-map',

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
        exclude: /(examples|node_modules|bower_components|bundle|lib)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /examples|node_modules/,
        use: [
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: './src/mathjax/my-BaseMappings.js', to: './lib/mathjax/my-BaseMappings.js' },
    ]),
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    })
  ],
  externals: {
    'react': 'commonjs react'
  },
});

// Return Array of Configurations
module.exports = [ indexConfig ];
