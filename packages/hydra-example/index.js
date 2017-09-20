const path = require('path')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const { graphiqlExpress } = require('apollo-server-express')

const { PORT = 3000, REDIS_URL } = process.env

const app = express()

// gzip assets
if (IS_PRODUCTION) app.use(compression())

app.use('/graphql', (...handler) => {
  const { handleGraphQL, handleError } = require(`./${IS_PRODUCTION
    ? 'lib'
    : 'src'}/server`)

  handleGraphQL(...handler).catch(e => {
    if (IS_PRODUCTION) Raven.captureException(e)
    handleError(e, ...handler)
  })
})

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

// Require server.js request handler for everything else
app.use((...handler) => {
  const { handleRequest, handleError } = require(`./${IS_PRODUCTION
    ? 'lib'
    : 'src'}/server`)

  handleRequest(...handler).catch(e => {
    if (IS_PRODUCTION) Raven.captureException(e)
    handleError(e, ...handler)
  })
})

// Set up Raven for error handling
if (IS_PRODUCTION) app.use(Raven.errorHandler())

// Error handler for sync errors
app.use((err, req, res, next) => {
  const { handleError } = require(`./${IS_PRODUCTION ? 'lib' : 'src'}/server`)

  handleError(err, req, res, next)
})
