const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');

const config = {
  entry: {
    // vender: './src/vendor',
    main: './src/scripts/main'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.ts$/, exclude: /node_modules/, loader: 'tslint-loader' },
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
      { test: /\.html/, loader: 'html-loader?minimize=false' },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            },
          },
          'css-loader',
          'sass-loader',
        ]

      },
      { test: /\.(gif|png|jpe?g)$/i, loader: 'file-loader?name=dist/images/[name].[ext]' },
      { test: /\.woff2?$/, loader: 'url-loader?name=dist/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)$/, loader: 'file-loader?name=dist/fonts/[name].[ext]' }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    })
  ],
  devServer: {
    stats: {
      assets: true,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: true,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: false,
      errors: true,
      errorDetails: true,
      hash: false,
      maxModules: 0,
      modules: false,
      performance: true,
      providedExports: false,
      publicPath: false,
      reasons: false,
      source: false,
      timings: true,
      usedExports: false,
      version: false,
      warnings: true
    }
  },
  optimization: {
    concatenateModules: true,
    minimize: false,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
          screw_ie8: true,
          warnings: false
        },
          comments: false,
          sourceMap: false
        }
      }),
    ]
  }
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
    })
  ]);
}

module.exports = config;
