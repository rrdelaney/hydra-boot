// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux'
import type {
  Store as _Store,
  Dispatch as _Dispatch,
  Reducer as _Reducer
} from 'redux'
import type { ApolloClient } from 'react-apollo'
import reducers from './reducers'
import type { State } from './reducers'
import type { Action } from './constants'

export type Dispatch = _Dispatch<Action>
export type Reducer = _Reducer<State, Action>
export type Store = _Store<State, Action, Dispatch>
export type { State }

export default function configureStore(
  initialState?: State,
  client?: ApolloClient
): Store {
  const rootReducer: Reducer = client
    ? combineReducers({ ...reducers, apollo: client.reducer() })
    : combineReducers(reducers)

  const enhancer = client
    ? applyMiddleware(client.middleware())
    : applyMiddleware()

  return initialState
    ? createStore(rootReducer, initialState, enhancer)
    : createStore(rootReducer, enhancer)
}
