/* eslint global-require: 'off' */
const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

module.exports = {
  api: path.resolve(appDirectory, 'src/api'),
  pages: path.resolve(appDirectory, 'src/pages'),
  reducers: path.resolve(appDirectory, 'src/reducers'),
  components: path.resolve(appDirectory, 'src/components'),
  widgets: path.resolve(appDirectory, 'src/components/widgets'),
  icons: path.resolve(appDirectory, 'src/components/common/icons'),
  utils: path.resolve(appDirectory, 'src/utils'),
  middlewares: path.resolve(appDirectory, 'src/middlewares'),
  styles: path.resolve(appDirectory, 'src/assets/styles'),
  data: path.resolve(appDirectory, 'src/data'),
}
