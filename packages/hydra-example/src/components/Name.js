import React from 'react'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'

const mapStateToProps = state => ({
  name: state.auth && state.auth.name
})

export function Name({ name }) {
  return name ? (
    <Header as="h2">Hello {name}!!</Header>
  ) : (
    <Header as="h2">Not logged in</Header>
  )
}

export default connect(mapStateToProps)(Name)
