// @flow

import RenderStream from 'render-stream'

type Next = {
  initialState?: string,
  initialStyles?: string,
  error?: Error
}

const sentryDsn =
  typeof process.env.SENTRY_DSN === 'string'
    ? process.env.SENTRY_DSN.replace(/\:[\d\w]+/, '')
    : ''

const errorParts = {
  endHead: () => `<style>
    h1 {
      color: red;
      font-family: 'Helvetica Neue';
      font-size: 36pt;
      font-weight: 300;
    }
    pre {
      font-family: 'Operator Mono';
      font-size: 10pt;
      width: 90vw;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div>`,
  endBody: error => `</div>
  <h1>There was an error :(</h1>
  <pre>${error.stack}</pre>
</body>
</html>`
}

export default function* page(
  assets: string[]
): Generator<string, string, Next> {
  const { initialState, initialStyles, error: error1 } = yield `<!doctype html>
<html lang="en">
  <head>
    <title>Things</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" media="all"></link>
    ${assets
      .filter(s => s.endsWith('.css'))
      .map(s => `<link rel="stylesheet" href="/${s}">`)
      .join('    \n')}
    ${assets
      .filter(s => s.endsWith('.js') && !s.includes('hot-update'))
      .map(s => `<script async src="/${s}"></script>`)
      .join('    \n')}
    <script>window.SENTRY_DSN = '${sentryDsn}'</script>
    <script>window.onPageLoad = new Promise(resolve => { window.pageLoaded = resolve })</script>`

  if (error1) {
    return errorParts.endHead() + errorParts.endBody(error1)
  }

  const { error: error2 } = yield `${initialStyles ||
    ''}<script>window.INITIAL_STATE = ${initialState || 'undefined'}</script>
  </head>
  <body>
    <div id="root">`

  if (error2) {
    return errorParts.endBody(error2)
  }

  return `</div>
    <script>window.pageLoaded()</script>
  </body>
</html>`
}

export const renderPage = () =>
  new RenderStream(
    ({ render, handler, flush, locals }) => render`<!doctype html>
<html lang="en">
  <head>
    <title>Things</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css" media="all"></link>
    ${'' /*(async () => {
      const assets = await locals.assets
      return assets
        .filter(s => s.endsWith('.css'))
        .map(s => `<link rel="stylesheet" href="/${s}">`)
        .join('    \n')
    })()*/}
    ${'' /*(async () => {
      const assets = await locals.assets
      return assets
        .filter(s => s.endsWith('.js') && !s.includes('hot-update'))
        .map(s => `<script async src="/${s}"></script>`)
        .join('    \n')
    })()*/}
    <script>window.SENTRY_DSN = '${sentryDsn}'</script>
    <script>window.onPageLoad = new Promise(resolve => { window.pageLoaded = resolve })</script>
    ${flush}
    ${handler(
      error => `<style>
      h1 {
        color: red;
        font-family: 'Helvetica Neue';
        font-size: 36pt;
        font-weight: 300;
      }
      pre {
        font-family: 'Operator Mono';
        font-size: 10pt;
        width: 90vw;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div>`
    )}
    ${locals.initialStyles}
    <script>window.INITIAL_STATE = ${locals.initialState}</script>
    </head>
    <body>
      <div id="root">
    ${flush}
    ${locals.reactStream}
    ${handler(
      error => `</div>
    <h1>There was an error :(</h1>
    <pre>${error.stack}</pre>
  </body>
  </html>`
    )}
  </div>
    <script>window.pageLoaded()</script>
  </body>
</html>`
  )
