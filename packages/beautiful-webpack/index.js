// @flow

const chalk = require('chalk')
const boxen = require('boxen')
const openBrowser = require('react-dev-utils/openBrowser')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const isInteractive = process.stdout.isTTY

module.exports = class BeautifulWebpack {
  constructor(app, address) {
    this.app = app
    this.address = address
    this.hasShownInstructions = false
  }

  getInstructions() {
    this.hasShownInstructions = true

    return boxen(
      `
You can now view ${chalk.underline(this.app)} in the browser at

    ${chalk.underline(this.address)}

Note that the development build is not optimized.
To create a production build, run ${chalk.yellow('yarn build')}.
    `.trim(),
      { borderColor: 'green', padding: 1, margin: 1 }
    )
  }

  apply(compiler) {
    compiler.plugin('after-plugins', () => {
      if (isInteractive) {
        clearConsole()
        setTimeout(() => {
          openBrowser(this.address)
        }, 2000)
      }

      console.log(chalk.yellow('Starting...'))
      console.log()
      console.log()
      console.log(chalk.underline.yellow('Logs:'))
    })

    compiler.plugin('invalid', () => {
      if (isInteractive) clearConsole()

      console.log(chalk.yellow('Compiling...'))
      console.log()
      console.log()
      console.log(chalk.underline.yellow('Logs:'))
    })

    compiler.plugin('done', stats => {
      if (isInteractive) clearConsole()

      const messages = formatWebpackMessages(stats.toJson({}, true))
      const isSuccessful = !messages.errors.length && !messages.warnings.length

      if (isInteractive && !this.hasShownInstructions) {
        const instructions = this.getInstructions()
        console.log(instructions)
      }

      if (isSuccessful) {
        console.log(chalk.green('Compiled successfully!'))
        console.log()
        console.log()
      }

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }

        console.log(chalk.red('Failed to compile.'))
        console.log()
        console.log(messages.errors.join('\n\n'))
        return
      }

      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(messages.warnings.join('\n\n'))

        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        )
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        )
      }

      console.log(chalk.underline.yellow('Logs:'))
    })
  }
}
