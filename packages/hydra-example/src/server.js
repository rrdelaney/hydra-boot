// @flow

import * as React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { getDataFromTree } from 'react-apollo'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import serialize from 'serialize-javascript'
import type { $Request, $Response, NextFunction } from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { StaticRouter } from 'react-router-dom'
import log from 'hydra-log'
import createPage from './page'
import configureServerClient from './apollo/configureServerClient'
import schema from './api/schema'
import Context from './api/context'
import App from './components/App'
import configureStore from './store'
import { login } from './store/actions'

export async function handleRequest(req: $Request, res: $Response) {
  const assets = getAssets(res)
  const page = createPage(assets)

  const { value: head } = page.next()
  if (!head) throw new Error('Expected a head from page!')

  try {
    res.status(200)
    res.write(head)

    const context = new Context()
    const store = configureStore()
    const client = configureServerClient(context)
    const sheet = new ServerStyleSheet()
    const routerContext: { url?: string } = {}

    const app = (
      <StaticRouter location={req.url} context={routerContext}>
        <StyleSheetManager sheet={sheet.instance}>
          <App store={store} client={client} />
        </StyleSheetManager>
      </StaticRouter>
    )

    await getDataFromTree(app)
    const initialState = getInitialState(store, client)
    const initialStyles = sheet.getStyleTags()

    const { value: startBody } = page.next({ initialState, initialStyles })
    if (!startBody) throw new Error('Expected the body to start from the page!')
    res.write(startBody)

    const appRender = renderToNodeStream(app)
    appRender.on('data', data => res.write(data))

    await new Promise((resolve, reject) => {
      appRender.on('end', resolve)
      appRender.on('error', reject)
    })

    const { value: body } = page.next({})
    if (!body) throw new Error('Expected a body from page!')
    res.end(body)
  } catch (error) {
    log(error)
    const { value: end } = page.next({ error })
    res.end(end)
  }
}

export function handleError(
  err: Error,
  req: $Request,
  res: $Response,
  next: NextFunction
) {
  log(err)

  return res.status(500).send(`Internal server error`)
}

export const routes = {
  '/graphql': async function handleGraphQL(
    ...handler: [$Request, $Response, NextFunction]
  ) {
    const [req] = handler
    const context = new Context()

    return graphqlExpress({ schema, context })(...handler)
  },
  '/graphiql': graphiqlExpress({
    endpointURL: '/graphql'
  })
}

function getAssets(res: any): string[] {
  if (res.locals.assets) {
    return res.locals.assets
  } else {
    return [].concat(res.locals.webpackStats.toJson().assetsByChunkName.main)
  }
}

function getInitialState(store, client): string {
  const initialState = {
    ...store.getState(),
    apollo: client.getInitialState()
  }

  return serialize(initialState, { isJSON: true })
}
