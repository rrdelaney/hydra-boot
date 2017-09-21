// @flow

const hydraBoot = require('hydra-boot')
const compression = require('compression')
const bodyParser = require('body-parser')
const { graphiqlExpress } = require('apollo-server-express')

const { PORT = 3000, REDIS_URL } = process.env

const serverModule = `./${process.env.NODE_ENV === 'production'
  ? 'lib'
  : 'src'}/server`

const app = hydraBoot(() => require(serverModule))

if (app.isProduction()) app.express.use(compression())

app.express.use('/graphql', (...handler) => {
  const { handleGraphQL, handleError } = require(serverModule)

  handleGraphQL(...handler).catch(e => {
    handleError(e, ...handler)
  })
})

app.express.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

app.start()
