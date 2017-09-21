// @flow

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
if (!IS_PRODUCTION) require('babel-register')({ cache: false })
require('dotenv').config()

const { PORT = '3000' } = process.env

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const chalk = require('chalk')
/*:: import type { $Application, $Request, $Response, NextFunction, Middleware } from 'express' */

/*::
type AppConfig = () => {
  handleRequest(req: $Request, res: $Response): Promise<void>,
  handleError(
   err: Error,
   req: $Request,
   res: $Response,
   next: NextFunction
 ): Promise<void>
}

type HydraApp = {
  express: $Application,
  bootWebpack(config: any): void,
  handle(route: string, handler: Middleware): void,
  start(): void,
  isProduction(): boolean,
  logMsg(msg: string): void,
  logErr(msg: string): void
}
*/

function createApp(serverConfig /*: AppConfig */) /*: HydraApp */ {
  const app = express()

  const logMsg = msg => console.log(chalk.cyan(`==> ${msg}`))

  const logErr = err => console.error(chalk.red(`==> ${err}`))

  app.use((...handler) => {
    const { handleRequest, handleError } = serverConfig()

    handleRequest(...handler).catch(e => {
      handleError(e, ...handler)
    })
  })

  app.use((
    err /*: ?Error */,
    req /*: $Request */,
    res /*: $Response */,
    next /*: NextFunction */
  ) => {
    const { handleError } = serverConfig()

    if (err) handleError(err, req, res, next)
  })

  const bootWebpack = (webpackConfig /*: ?any */) => {
    if (IS_PRODUCTION) {
      const webpack = require('webpack')
      const webpackDevMiddleware = require('webpack-dev-middleware')
      const webpackHotMiddleware = require('webpack-hot-middleware')
      webpackConfig = webpackConfig || require('hydra-webpack-config')

      const compiler = webpack(webpackConfig)
      app.use(
        webpackDevMiddleware(compiler, {
          noInfo: true,
          serverSideRender: true,
          quiet: true,
          stats: {
            colors: true
          }
        })
      )

      app.use(webpackHotMiddleware(compiler, { log: false }))
    } else {
      const stats = require(path.join(process.cwd(), 'build', 'stats'))
      const assets = [stats['main.js']]

      app.use(express.static('build'))
      app.use((
        req /*: $Request */,
        res /*: $Response */,
        next /*: NextFunction */
      ) => {
        res.locals.assets = assets
        next()
      })
    }
  }

  const isProduction = () => IS_PRODUCTION

  const handle = (route, handler) => {
    app.use(route, handler)
  }

  const start = () => {
    app.listen(PORT, () => {
      logMsg(`Listening at port ${PORT}`)
    })
  }

  app.use(
    morgan(
      `${chalk.cyan(
        'REQUEST '
      )} :method :url :status :response-time ms - :res[content-length]`
    )
  )

  if (!IS_PRODUCTION) {
    const gaze = require('gaze')

    gaze(['src/**/*.js', 'schema.graphql'], (err, watcher) => {
      watcher.on('changed', filepath => {
        for (let name in require.cache) {
          if (name.startsWith(path.resolve(process.cwd(), 'src'))) {
            delete require.cache[name]
          }
        }
      })
    })
  }

  return {
    express: app,
    bootWebpack,
    handle,
    start,
    isProduction,
    logMsg,
    logErr
  }
}

module.exports = createApp
