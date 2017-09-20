// @flow

import * as React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { getDataFromTree } from 'react-apollo'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import serialize from 'serialize-javascript'
import type { $Request, $Response, NextFunction } from 'express'
import { graphqlExpress } from 'apollo-server-express'
import { StaticRouter } from 'react-router-dom'
import log from './log'
import createPage from './page'
import configureServerClient from './apollo/configureServerClient'
import _db from './api/db'
import schema from './api/schema'
import Context from './api/context'
import App from './components/App'
import configureStore from './store'
import { login } from './store/actions'

export async function registerUser(profile: {
  id: string,
  displayName: string
}) {
  const db = await _db
  const user = await db.users.findOne({ id: profile.id })

  if (!user) {
    return db.users.insert({ id: profile.id, name: profile.displayName })
  } else {
    return user
  }
}

export async function handleGraphQL(
  ...handler: [$Request, $Response, NextFunction]
) {
  const [req] = handler
  const context = new Context(await _db, serializeUser(req))

  return graphqlExpress({ schema, context })(...handler)
}

export async function handleRequest(req: $Request, res: $Response) {
  const assets = getAssets(res)
  const page = createPage(assets)

  const { value: head } = page.next()
  if (!head) throw new Error('Expected a head from page!')

  try {
    res.status(200)
    res.write(head)

    const user = serializeUser(req)
    const context = new Context(await _db, user)
    const store = configureStore()
    const client = configureServerClient(context)
    const sheet = new ServerStyleSheet()
    const routerContext: { url?: string } = {}

    if (user) store.dispatch(login(user))

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

function getAssets(res: any): string[] {
  if (res.locals.assets) {
    return res.locals.assets
  } else {
    return [].concat(res.locals.webpackStats.toJson().assetsByChunkName.main)
  }
}

function serializeUser(req): { id: string, name: string } | null {
  ;(req: any)

  if (!req.user) return null

  return (req.user: any)
}

function getInitialState(store, client): string {
  const initialState = {
    ...store.getState(),
    apollo: client.getInitialState()
  }

  return serialize(initialState, { isJSON: true })
}
