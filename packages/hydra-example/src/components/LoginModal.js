// @flow

import * as React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

type LoginModalProps = {
  open: boolean,
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIcon
      basic
      dimmer="blurring"
      size="small"
    >
      <Header icon="sign in" content="Sign in" />
      <Modal.Content>
        <p>
          <Button color="facebook">
            <Icon name="facebook" /> Facebook
          </Button>
        </p>

        <p>
          <Button color="google plus">
            <Icon name="google plus" /> Google
          </Button>
        </p>
      </Modal.Content>
    </Modal>
  )
}
