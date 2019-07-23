const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const { handleRelated } = require('./server')

const appDirectory = fs.realpathSync(process.cwd())
const distPath = path.resolve(appDirectory, 'dist')
const viewsPath = path.resolve(appDirectory, 'views')

console.log(`distPath: ${distPath}`)

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(compression())

app.use(express.static(distPath))

app.set('view engine', 'pug')

app.set('views', viewsPath)

app.get('/related/:systemID/:time', handleRelated(distPath))

// app.get('/br/:brID', (request, response) => {
//   response.render('index', getParams())
// })

app.get('*', (request, response) => {
  response.sendFile(`${distPath}/index.html`)
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
