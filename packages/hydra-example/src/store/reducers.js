// @flow

import auth from './auth'
import type { AuthState } from './auth'
import modal from './modal'
import type { ModalState } from './modal'

export type State = { +auth: AuthState, +modal: ModalState }

export default {
  auth,
  modal
}
