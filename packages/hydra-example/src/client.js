// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import configureStore from './store'
import configureBrowserClient from './apollo/configureBrowserClient'
import App from './components/App'

let root
let store
let client

window.onPageLoad =
  window.onPageLoad ||
  new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', resolve)
  })

window.onPageLoad.then(() => {
  root = document.getElementById('root')
  client = configureBrowserClient()
  store = configureStore(window.INITIAL_STATE, client)

  ReactDOM.hydrate(
    <BrowserRouter>
      <App store={store} client={client} />
    </BrowserRouter>,
    root
  )
})
;(module: any)
if (module.hot) {
  ;(module.hot: any).accept('./components/App', () => {
    const NextApp = require('./components/App').default
    ReactDOM.render(
      <BrowserRouter>
        <NextApp store={store} client={client} />
      </BrowserRouter>,
      root
    )
  })
}
