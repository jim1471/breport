/* eslint global-require: 'off' */

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const PurgecssPlugin = require('purgecss-webpack-plugin')

const eslintFormatter = require('react-dev-utils/eslintFormatter')
const getClientEnvironment = require('./env')

const appDirectory = fs.realpathSync(process.cwd())
const outputDir = path.resolve(appDirectory, 'dist')
// Get environment variables to inject into our app.
const env = getClientEnvironment()

// const PATHS = {
//   src: path.resolve(appDirectory, 'src'),
//   // nodeModules: path.resolve(appDirectory, 'node_modules'),
// }

// console.warn('SRC:', PATHS.src)

module.exports = {
  mode: 'production',
  // https://webpack.js.org/configuration/stats/#stats
  stats: {
    assets: true,
    children: false,
    chunks: true,
    chunkModules: false,
    colors: true,
    entrypoints: false,
    env: true,
    errors: true,
    errorDetails: true,
    publicPath: true,
    performance: false,
    modules: false,
    timings: true,
    warnings: true,
  },
  entry: {
    main: './src/index.jsx',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      ...require('./aliases'),
    },
  },
  output: {
    pathinfo: true,
    publicPath: '/',
    path: outputDir,
    filename: '[name].[chunkhash].js',
  },
  performance: {
    hints: false,
  },
  // splitting vendor code in separate chunks (css also)
  // https://webpack.js.org/plugins/split-chunks-plugin/
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
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
        // styles: {
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true
        // },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(
      [outputDir],
      { root: appDirectory },
    ),
    new CopyWebpackPlugin([{
      from: 'public/',
      to: outputDir,
      ignore: ['index.html'],
    }]),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, 'public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      },
    }),
    new webpack.NormalModuleReplacementPlugin(
      /.*\/generated\/iconSvgPaths.*/,
      path.resolve(__dirname, '../src/assets/bpIcons.js'),
    ),
    new webpack.HashedModuleIdsPlugin(),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      // chunkFilename: '[id].[hash].css',
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    //   // only: ['commons', 'vendors'],
    // }),
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
              compact: true,
              cacheDirectory: true,
              plugins: ['lodash', 'date-fns'],
            },
          },
        ],
      },
      // {
      //   test: /\.(scss|css)$/,
      //   include: /node_modules/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     { loader: 'css-loader' },
      //   ],
      // },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: require.resolve('css-loader'), options: {
            importLoaders: 2,
            minimize: false,
            import: false,
            modules: false,
            camelCase: true,
            localIdentName: '[hash:base64:8]',
          } },
          { loader: require.resolve('postcss-loader'), options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('autoprefixer')({
                browsers: [
                  'last 5 versions',
                  'Firefox ESR',
                  'not ie < 11',
                ],
              }),
              // uncomment for build and test prod-like styles
              require('cssnano')({
                svgo: false,
                reduceIdents: false,
              }),
            ],
          } },
          { loader: require.resolve('fast-sass-loader'), options: {
            includePaths: [
              path.resolve(appDirectory, 'src/assets/styles'),
              path.resolve(appDirectory, 'src'),
            ],
          } },
        ],
      },
      {
        // Exclude `js` files to keep 'css' loader working as it injects
        // its runtime that would otherwise processed through 'file' loader.
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
