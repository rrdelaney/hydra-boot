// @flow

import { ApolloClient, createNetworkInterface } from 'react-apollo'

export default function configureBrowserClient() {
  const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  })

  return new ApolloClient({
    networkInterface
  })
}
