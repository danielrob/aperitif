import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import appReducer from './containers/App/duck'

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
  // eslint-disable-next-line no-underscore-dangle
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false })
  : compose


export default function configureStore(history) {
  const middleware = applyMiddleware(routerMiddleware(history))
  const enhancer = composeEnhancers(middleware)

  return createStore(
    combineReducers({
      app: appReducer,
      router: routerReducer,
    }),
    enhancer,
  )
}

