/* eslint no-underscore-dangle: "off" */
import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import apiCallMiddleware from 'middlewares/apiCallMiddleware'
import payloadMiddleware from 'middlewares/payloadMiddleware'
import reducers from './reducers'


const middleware = [
  thunk,
  apiCallMiddleware,
  payloadMiddleware,
]

const actionSanitizer = action => (
  action.type === 'HYDRATE_STORE' && action.payload
    ? { ...action, payload: '<<LONG_BLOB>>' }
    : action
)
const stateSanitizer = state => {
  let newState = state.related.kmData
    ? { ...state, related: { ...state.related, kmData: '<<TOO_MUCH_DATA>>' } }
    : state
  const { battlereport } = newState
  const { br } = battlereport || {}
  newState = br && br.kmData
    ? { ...newState, battlereport: { ...battlereport, br: { ...br, kmData: '<<TOO_MUCH_DATA>>' } } }
    : newState
  return newState
}

const reduxDevtoolsExtensionOptions = {
  actionSanitizer,
  stateSanitizer,
}

let composeEnhancers = compose
if (process.env.NODE_ENV === 'development') {
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(reduxDevtoolsExtensionOptions)
  }
}

const configureStore = () => {
  const store = createReduxStore(
    reducers,
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  )

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers)
    })
  }

  if (process.env.NODE_ENV === 'development') {
    window.store = store
  }

  return store
}

export default configureStore
