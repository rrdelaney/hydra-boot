// @flow

import { ApolloClient } from 'react-apollo'
import { createLocalInterface } from 'apollo-local-query'
import * as graphql from 'graphql'
import schema from '../api/schema'
import type Context from '../api/context'

export default function configureServerClient(context: Context) {
  const networkInterface = createLocalInterface(graphql, schema, { context })

  return new ApolloClient({
    ssrMode: true,
    networkInterface
  })
}
