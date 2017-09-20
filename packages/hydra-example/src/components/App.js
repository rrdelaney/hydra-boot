// @flow

import * as React from 'react'
import { ApolloProvider, ApolloClient } from 'react-apollo'
import { Route, Switch } from 'react-router'
import type { Store } from '../store'
import Home from './Home'
import Article from './Article'
import NotFound from './NotFound'

type AppProps = {
  store: Store,
  client: ApolloClient
}

export default function App({ store, client }: AppProps) {
  return (
    <ApolloProvider store={store} client={client}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/article/:id" component={Article} />
        <Route component={NotFound} />
      </Switch>
    </ApolloProvider>
  )
}
