module.exports = env =>
  env === 'production'
    ? require('./webpack.config.prod')
    : require('./webpack.config.dev')
