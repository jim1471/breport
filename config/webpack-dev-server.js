/* eslint no-console: 'off' */
/* eslint global-require: 'off' */

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
process.env.HMR = true

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const config = require('./webpack.config.dev.js')

const defaultPort = 3200
const PORT = parseInt(process.env.PORT, 10) || defaultPort
const HOST = process.env.HOST || '0.0.0.0'
const appDirectory = fs.realpathSync(process.cwd())
const contentBase = path.resolve(appDirectory, 'public')

// more options here: https://webpack.js.org/configuration/dev-server/
const devServerConfig = {
  contentBase,
  publicPath: config.output.publicPath,
  host: '0.0.0.0',
  hot: true,
  hotOnly: true,
  inline: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  overlay: {
    warnings: false,
    errors: true,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      secure: false,
      prependPath: false,
    },
  },
  compress: true,
  disableHostCheck: true,
  // more info here: https://webpack.js.org/configuration/stats/
  stats: {
    assets: true,
    children: false,
    chunks: true,
    chunkModules: false,
    colors: true,
    entrypoints: false,
    errors: true,
    errorDetails: true,
    modules: false,
    timings: true,
    warnings: true,
  },
  // if you are not happy with all that verbose info in your console,
  // just uncomment next line:
  // stats: 'minimal',
}

let compiler
try {
  compiler = webpack(config)
} catch (err) {
  console.log(chalk.red('Failed to compile.'))
  console.log()
  console.log(err.message || err)
  console.log()
  process.exit(1)
}

const devServer = new WebpackDevServer(compiler, devServerConfig)

devServer.listen(PORT, HOST, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log(`Starting webpack-dev-server on http://localhost:${PORT}`)
  openBrowser(`http://localhost:${PORT}`)
})

const quitSignals = ['SIGINT', 'SIGTERM']
quitSignals.forEach(sig => {
  process.on(sig, () => {
    devServer.close()
    process.exit()
  })
})
