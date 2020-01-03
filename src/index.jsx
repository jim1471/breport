import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { FocusStyleManager } from 'components/common/blueprint'
import routerHistory from 'utils/routerHistory'
import configureStore from './store'
import Root from './Root'

FocusStyleManager.onlyShowFocusOnTabs()

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Router history={routerHistory}>
      <Root />
    </Router>
  </Provider>
)

/* eslint-disable */
// debug - removes displaying __proto__ from objects in console
console.debug = function() {
  function clear(o) {

    var obj = JSON.parse(JSON.stringify(o))
    // [!] clone

    if (obj && typeof obj === 'object') {
      obj.__proto__ = null
      // clear

      for (var j in obj) {
        obj[j] = clear(obj[j]) // recursive
      }
    }
    return obj;
  }
  for (var i = 0, args = Array.prototype.slice.call(arguments, 0); i < args.length; i++) {
    args[i] = clear(args[i])
  }
  console.log.apply(console, args)
}
/* eslint-enable */


ReactDOM.render(<App />, document.getElementById('react-root'))
