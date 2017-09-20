// @flow

import type { Action, ModalKind } from './constants'

export type ModalState = { +modalKind: ModalKind }

const initialState = { modalKind: null }

export default function reducer(
  state: ModalState = initialState,
  action: Action
): ModalState {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return { modalKind: action.modalKind }

    default:
      return state
  }
}
