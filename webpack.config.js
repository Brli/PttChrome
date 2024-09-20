const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;

const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { options } = require('yargs');

const config = {
  entry: './src/scripts/main',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      // { enforce: 'pre', test: /\.ts$/, exclude: /node_modules/, loader: 'tslint-loader' },
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
      // { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html/,
        loader: 'html-loader',
        options: {
          minimize: false,
        },
       },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
        ],
      },
      { test: /\.(gif|png|jpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: 'dist/images/[name].[ext]',
        },
      },
      { test: /\.woff2?$/,
        loader: 'url-loader',
        options: {
          name: 'dist/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
        },
      },
      { test: /\.(ttf|eot|svg)$/,
        loader: 'file-loader',
        options:{
          name: 'dist/fonts/[name].[ext]',
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new ESLintPlugin(),
  ],
  optimization: {
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin()],
  },
  devServer: {}
}

if (env !== 'prod') {
  config.devtool = 'source-map';
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'WEBPACK_ENV': '"dev"'
    })
  ]);
} else {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'WEBPACK_ENV': '"production"'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/index.html' }
      ]
    }),
  ]);
}

module.exports = config;
