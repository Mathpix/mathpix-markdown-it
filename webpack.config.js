const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const config = {
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};

/** Shared module rules and plugins used by all browser/standalone bundles. */
const browserModule = {
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
};

const browserPlugins = [
  new NodePolyfillPlugin({
    excludeAliases: ["console"]
  })
];

/** Helper: create a browser bundle config with shared module rules and plugins. */
const makeBrowserBundle = (name, entryPath, outputPath, outputFilename) =>
  Object.assign({}, config, {
    name,
    entry: { main: [path.join(__dirname, entryPath)] },
    output: {
      path: path.resolve(__dirname, outputPath),
      filename: outputFilename,
    },
    module: browserModule,
    plugins: browserPlugins,
  });

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

const bundleConfig = makeBrowserBundle("bundle", './src/bundle.tsx', './es5/', 'bundle.js');
const contextMenuConfig = makeBrowserBundle("context-menu", './src/context-menu.tsx', './es5/', 'context-menu.js');
const copyToClipboardCodeConfig = makeBrowserBundle("copy-to-clipboard-code", './src/copy-to-clipboard-code.tsx', './es5/', 'copy-to-clipboard-code.js');
const autoRenderConfig = makeBrowserBundle("auto-render", './src/browser/auto-render.ts', './es5/browser/', 'auto-render.js');
const addSpeechConfig = makeBrowserBundle("add-speech", './src/browser/add-speech.ts', './es5/browser/', 'add-speech.js');

// Return Array of Configurations
module.exports = [ indexConfig, bundleConfig, contextMenuConfig, copyToClipboardCodeConfig, autoRenderConfig, addSpeechConfig ];
