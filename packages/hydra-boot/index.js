// @flow

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
if (!IS_PRODUCTION) require('babel-register')({ cache: false })
require('dotenv').config()

const { PORT = '3000' } = process.env

const express = require('express')
const chalk = require('chalk')
/*:: import type { $Application, $Request, $Response, NextFunction } from 'express' */

/*::
type AppConfig = {
  handleRequest(req: $Request, res: $Response): void | Promise<void>,
  handleError(
   err: Error,
   req: $Request,
   res: $Response,
   next: NextFunction
 ): void | Promise<void>
}

type Handler = (req: $Request, res: $Response, next: NextFunction) => any

type HydraApp = {
  app: $Application,
  bootWebpack(config: any): void,
  handle(route: string, handler: Handler): void,
  use(handler: Handler): void,
  start(): void,
  isProduction(): boolean,
  logMsg(msg: string): void,
  logErr(msg: string): void
}
*/

function createApp(config /*: AppConfig */) /*: HydraApp */ {
  const app = express()

  const logMsg = msg => console.log(chalk.cyan(`==> ${msg}`))

  const logErr = msg => console.error(chalk.red(`==> ${err}`))

  const bootWebpack = config => {
    if (IS_PRODUCTION) {
      const webpack = require('webpack')
      const webpackDevMiddleware = require('webpack-dev-middleware')
      const webpackHotMiddleware = require('webpack-hot-middleware')
      const webpackConfig = require('./scripts/webpack.config.dev')

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
      app.use((req, res, next) => {
        res.locals.assets = assets
        next()
      })
    }
  }

  const isProduction = () => IS_PRODUCTION

  const use = middleware => app.use(middleware)

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
    app,
    bootWebpack,
    use,
    start,
    isProduction,
    logMsg,
    logErr
  }
}
