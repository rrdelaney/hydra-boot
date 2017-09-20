// @flow

import type { Action } from './constants'

export type AuthState = { +id: string, +name: string } | null

const initialState = null

export default function reducer(
  state: AuthState = initialState,
  action: Action
): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return action.user

    default:
      return state
  }
}
