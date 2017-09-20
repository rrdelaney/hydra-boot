// @flow

import * as React from 'react'
import { Link } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'
import styled from 'styled-components'
import { Menu } from 'semantic-ui-react'
import type { State, Dispatch } from '../store'
import { showModal as showModalAction } from '../store/actions'
import LoginModal from './LoginModal'

const AppHeaderContainer = styled.div`
  border-radius: 0 !important;
  padding: 0;
  margin: 0 !important;
`

const mapStateToProps = (state: State) => ({
  shouldShowLoginModal: state.modal.modalKind === 'login'
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ showModal: showModalAction }, dispatch)

const withUserData = graphql(gql`
  query UserData {
    self {
      id
    }
  }
`)

function AppHeader({ data, shouldShowLoginModal, showModal }) {
  const openLoginModal = () => showModal('login', true)
  const closeLoginModal = () => showModal('login', false)

  return (
    <Menu inverted as={AppHeaderContainer}>
      <Menu.Item name="Home" as={Link} to="/">
        Untitiled Edition
      </Menu.Item>
      <Menu.Menu position="right">
        {data.self && (
          <Menu.Item name="Logout" href="/logout">
            Logout
          </Menu.Item>
        )}
        {!data.self && (
          <Menu.Item name="Login" onClick={openLoginModal}>
            Login
          </Menu.Item>
        )}
        {!data.self && (
          <LoginModal open={shouldShowLoginModal} onClose={closeLoginModal} />
        )}
      </Menu.Menu>
    </Menu>
  )
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUserData
)(AppHeader)
