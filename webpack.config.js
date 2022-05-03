const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

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
  // entry: ["@babel/transform-runtime", path.join(__dirname, './src/index.tsx')],
  entry: [ path.join(__dirname, './src/index.tsx')],
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
  plugins: [
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    })
  ],
  externals: {
    'react': 'commonjs react'
  },
});

const bundleConfig = Object.assign({}, config,{
  name: "bundle",
  entry: {
    main: [
      // '@babel/polyfill',
      path.join(__dirname, './src/bundle.tsx'),
    ]
  },
  output: {
    path: path.resolve(__dirname, './es5/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|lib)/,
        loader: 'ts-loader',
      },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
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
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    })
  ],
});

const contextMenuConfig = Object.assign({}, config,{
  name: "context-menu",
  entry: {
    main: [
      // '@babel/polyfill',
      path.join(__dirname, './src/context-menu.tsx'),
    ]
  },
  output: {
    path: path.resolve(__dirname, './es5/'),
    filename: 'context-menu.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|lib)/,
        loader: 'ts-loader',
      },
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
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
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    })
  ],
});

// Return Array of Configurations
module.exports = [ indexConfig, bundleConfig, contextMenuConfig ];
