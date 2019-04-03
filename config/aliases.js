/* eslint global-require: 'off' */

const path = require('path')
const fs = require('fs')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())

module.exports = {
  api: path.resolve(appDirectory, 'src/api'),
  pages: path.resolve(appDirectory, 'src/pages'),
  reducers: path.resolve(appDirectory, 'src/reducers'),
  components: path.resolve(appDirectory, 'src/components'),
  utils: path.resolve(appDirectory, 'src/utils'),
  i18n: path.resolve(appDirectory, 'src/i18n'),
  middlewares: path.resolve(appDirectory, 'src/middlewares'),
  markup: path.resolve(appDirectory, 'src/markup'),
  assets: path.resolve(appDirectory, 'src/assets'),
  images: path.resolve(appDirectory, 'src/assets/images'),
  styles: path.resolve(appDirectory, 'src/assets/styles'),
  symbols: path.resolve(appDirectory, 'src/assets/images/symbols'),
}
