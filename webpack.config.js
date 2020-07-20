const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const initFileName = (type) =>
  isDevelopment ? `[name].${type}` : `[name].[contenthash:8].${type}`;

const initOptimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProduction) {
    const TerserWebpackPlugin = require('terser-webpack-plugin');
    const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

    config.minimizer = [
      new TerserWebpackPlugin(),
      new OptimizeCSSAssetsWebpackPlugin(),
    ];
  }
  return config;
};

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './js/main.js'],
  },
  output: {
    filename: path.join('js', initFileName('js')),
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@img': path.resolve(__dirname, 'src/img'),
      '@static': path.resolve(__dirname, 'src/static'),
    },
  },
  devtool: isDevelopment ? 'source-map' : '',
  optimization: initOptimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: './template/index.hbs',
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProduction,
      },
    }),
    new MiniCSSExtractPlugin({
      filename: path.join('css', initFileName('css')),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/static'),
          to: path.resolve(__dirname, 'public'),
        },
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'public/img'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
      {
        test: /\.hbs$/i,
        loader: 'handlebars-loader',
        query: {
          partialDirs: [path.resolve(__dirname, 'src/template/partials')],
          helperDirs: [path.resolve(__dirname, 'src/template/helpers')],
        },
      },
      {
        test: /\.(c|s[ac])ss$/i,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: isDevelopment,
              reloadAll: true,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img',
          emitFile: false,
        },
      },
      { test: /\.(ttf|woff|woff2|eot)$/i, loader: 'file-loader' },
      { test: /\.xml$/i, loader: 'xml-loader' },
    ],
  },
  devServer: {
    port: 4200,
    hot: isDevelopment,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
