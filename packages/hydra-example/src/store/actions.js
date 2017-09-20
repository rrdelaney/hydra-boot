// @flow

import type { Action, ModalKind } from './constants'

export function login(user: { id: string, name: string }): Action {
  return { type: 'LOGIN', user }
}

export function showModal(modalKind: ModalKind, open: boolean): Action {
  if (!open) {
    return { type: 'TOGGLE_MODAL', modalKind: null }
  } else {
    return { type: 'TOGGLE_MODAL', modalKind }
  }
}
