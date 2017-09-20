// @flow

const chalk = require('chalk')

const formatType = (type /*: ?string */, color /*: ?string */) =>
  chalk[color || 'white']((type || 'MESSAGE').padEnd(8))

function log(
  message /*: string | Error */,
  type /*: ?string */,
  color /*: ?string */
) {
  if (typeof message === 'string') {
    console.log(`${formatType(type, color)} ${message}`)
  } else {
    console.error(`${chalk.red('ERROR'.padEnd(8))} ${message.message}`)
    console.error(chalk.red(message.stack))
  }
}

module.exports = log
