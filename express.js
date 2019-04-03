require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const appDirectory = fs.realpathSync(process.cwd())
const distPath = path.resolve(appDirectory, 'dist')

console.log(`distPath: ${distPath}`)

const app = express()
app.set('port', (process.env.PORT || 5000))

app.use(compression())
app.use(express.static(distPath))

app.get('*', (request, response) => {
  response.sendFile(`${distPath}/index.html`)
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})
