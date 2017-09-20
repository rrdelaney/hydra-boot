import React from 'react'
import styled from 'styled-components'
import AppHeader from './AppHeader'

const Container = styled.div`width: 100vw;`

export default function AppContainer({ children }) {
  return (
    <Container>
      <AppHeader />
      {children}
    </Container>
  )
}
