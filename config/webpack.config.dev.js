/* eslint global-require: 'off' */

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const path = require('path') // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const getClientEnvironment = require('./env')

const appDirectory = fs.realpathSync(process.cwd())
const outputDir = path.resolve(appDirectory, 'dist')
// Get environment variables to inject into our app.
const env = getClientEnvironment()


module.exports = {
  mode: 'development',
  // devtool: 'cheap-module-eval-source-map', // original source (lines only)
  devtool: 'eval-source-map', // original source
  entry: {
    main: [
      'webpack-dev-server/client?http://0.0.0.0:3200', // WebpackDevServer host and port
      'webpack/hot/dev-server',
      'react-hot-loader/patch',
      './src/index.jsx',
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      ...require('./aliases'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    pathinfo: true,
    path: outputDir,
    publicPath: '/',
    filename: '[name].[hash].js',
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      automaticNameDelimiter: '-',
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, 'public/index.html'),
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    new webpack.NormalModuleReplacementPlugin(
      /.*\/generated\/iconSvgPaths.*/,
      path.resolve(__dirname, '../src/assets/bpIcons.js'),
    ),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: path.resolve(appDirectory, 'src'),
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(appDirectory, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              // This is a feature of `babel-loader` for Webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              plugins: ['lodash', 'date-fns', 'react-hot-loader/babel'],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        include: /node_modules/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              import: true,
              esModule: true,
              onlyLocals: false,
              localsConvention: 'camelCaseOnly',
              modules: {
                mode: 'global',
                localIdentName: '[path]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
              ],
            },
          },
          {
            loader: require.resolve('fast-sass-loader'),
            options: {
              includePaths: [
                path.resolve(appDirectory, 'src/assets/styles'),
                path.resolve(appDirectory, 'src'),
              ],
            },
          },
        ],
      },
      {
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        test: /\.(ico|gif|jpg|jpeg|png|svg|woff|woff2|ttf|eot)$/,
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /node_modules/],
        loader: require.resolve('file-loader'),
        options: {
          outputPath: '',
          context: path.resolve(appDirectory, 'src/assets/'),
          name: '[path][name].[ext]',
          emitFile: true, // required!
        },
      },
    ],
  },
}
