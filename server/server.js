const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const favicon = require('serve-favicon')

const app = express()
app.use(favicon(path.resolve(__dirname, '../favicon.ico')))
const isDev = process.env.NODE_ENV === 'development'

// 生产环境
if (!isDev) {
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const serverEntry = require('../dist/server-entry').default
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!--app-->', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
