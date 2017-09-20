// @flow

import * as React from 'react'
import AppContainer from './AppContainer'
import Name from './Name'
import Articles from './Articles'

export default function Home() {
  return (
    <AppContainer>
      <Name />
      <Articles />
    </AppContainer>
  )
}
