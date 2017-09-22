// @flow

const hydraBoot = require('hydra-boot')
const compression = require('compression')
const bodyParser = require('body-parser')

const { PORT = 3000 } = process.env

const serverModule = `./${process.env.NODE_ENV === 'production'
  ? 'lib'
  : 'src'}/server`

const app = hydraBoot(() => require(serverModule))

if (app.isProduction()) app.express.use(compression())

app.express.use(bodyParser.json())

app.bootWebpack()

app.start()
